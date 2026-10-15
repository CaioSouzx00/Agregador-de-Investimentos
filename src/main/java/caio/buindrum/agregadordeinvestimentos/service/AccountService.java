package caio.buindrum.agregadordeinvestimentos.service;

import caio.buindrum.agregadordeinvestimentos.Controller.Dto.AccountStockResponseDto;
import caio.buindrum.agregadordeinvestimentos.Controller.Dto.AccountValuationResponseDto;
import caio.buindrum.agregadordeinvestimentos.Controller.Dto.AssociateAccountStock;
import caio.buindrum.agregadordeinvestimentos.entity.Account;
import caio.buindrum.agregadordeinvestimentos.entity.AccountStock;
import caio.buindrum.agregadordeinvestimentos.entity.AccountStockId;
import caio.buindrum.agregadordeinvestimentos.exception.ResourceNotFoundException;
import caio.buindrum.agregadordeinvestimentos.repository.AccountRepository;
import caio.buindrum.agregadordeinvestimentos.repository.AccountStockRepository;
import caio.buindrum.agregadordeinvestimentos.repository.StockRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class AccountService {

    private final AccountRepository accountRepository;
    private final StockRepository stockRepository;
    private final AccountStockRepository accountStockRepository;
    private final StockPriceService stockPriceService;

    public AccountService(AccountRepository accountRepository,
                          StockRepository stockRepository,
                          AccountStockRepository accountStockRepository,
                          StockPriceService stockPriceService) {
        this.accountRepository = accountRepository;
        this.stockRepository = stockRepository;
        this.accountStockRepository = accountStockRepository;
        this.stockPriceService = stockPriceService;
    }

    @Transactional
    public void associateStock(String accountId, AssociateAccountStock associateAccountStock) {

        var account = accountRepository.findById(UUID.fromString(accountId))
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + accountId));

        var stock = stockRepository.findById(associateAccountStock.stockId())
                .orElseThrow(() -> new ResourceNotFoundException("Stock not found with id: " + associateAccountStock.stockId()));

        // DTO -> ENTITY
        var id = new AccountStockId(account.getAccountId(), stock.getStockId());
        var entity = new AccountStock(
                id,
                account,
                stock,
                associateAccountStock.quantity()
        );

        accountStockRepository.save(entity);
    }

    @Transactional(readOnly = true)
    public List<AccountStockResponseDto> ListStocks(String accountId) {

        var account = accountRepository.findById(UUID.fromString(accountId))
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + accountId));

        return account.getAccountStocks()
                .stream()
                .map(this::mapToAccountStockResponseDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public AccountValuationResponseDto getAccountValuation(String accountId) {

        var account = accountRepository.findById(UUID.fromString(accountId))
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with id: " + accountId));

        return buildAccountValuation(account);
    }

    public AccountValuationResponseDto buildAccountValuation(Account account) {
        List<AccountStockResponseDto> positions = account.getAccountStocks()
                .stream()
                .map(this::mapToAccountStockResponseDto)
                .toList();

        double totalValue = positions.stream()
                .mapToDouble(AccountStockResponseDto::total)
                .sum();

        double roundedTotal = Math.round(totalValue * 100.0) / 100.0;

        return new AccountValuationResponseDto(
                account.getAccountId().toString(),
                account.getDescription(),
                roundedTotal,
                positions,
                Instant.now()
        );
    }

    private AccountStockResponseDto mapToAccountStockResponseDto(AccountStock as) {
        String stockId = as.getStock().getStockId();
        double currentPrice = stockPriceService.getPrice(stockId);
        double total = Math.round((as.getQuantity() * currentPrice) * 100.0) / 100.0;

        return new AccountStockResponseDto(
                stockId,
                as.getQuantity(),
                currentPrice,
                total
        );
    }
}
