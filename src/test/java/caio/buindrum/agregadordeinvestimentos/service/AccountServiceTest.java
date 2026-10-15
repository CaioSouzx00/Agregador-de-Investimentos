package caio.buindrum.agregadordeinvestimentos.service;

import caio.buindrum.agregadordeinvestimentos.Controller.Dto.AssociateAccountStock;
import caio.buindrum.agregadordeinvestimentos.entity.Account;
import caio.buindrum.agregadordeinvestimentos.entity.AccountStock;
import caio.buindrum.agregadordeinvestimentos.entity.AccountStockId;
import caio.buindrum.agregadordeinvestimentos.entity.Stock;
import caio.buindrum.agregadordeinvestimentos.exception.ResourceNotFoundException;
import caio.buindrum.agregadordeinvestimentos.repository.AccountRepository;
import caio.buindrum.agregadordeinvestimentos.repository.AccountStockRepository;
import caio.buindrum.agregadordeinvestimentos.repository.StockRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AccountServiceTest {

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private StockRepository stockRepository;

    @Mock
    private AccountStockRepository accountStockRepository;

    @Mock
    private StockPriceService stockPriceService;

    @InjectMocks
    private AccountService accountService;

    @Captor
    private ArgumentCaptor<AccountStock> accountStockCaptor;

    @Nested
    class associateStock {

        @Test
        @DisplayName("Should associate stock with account successfully")
        void shouldAssociateStockSuccessfully() {
            var accountId = UUID.randomUUID();
            var account = new Account(accountId, null, null, "XP", new ArrayList<>());
            var stock = new Stock("PETR4", "Petrobras PN");
            var dto = new AssociateAccountStock("PETR4", 100);

            doReturn(Optional.of(account)).when(accountRepository).findById(accountId);
            doReturn(Optional.of(stock)).when(stockRepository).findById("PETR4");

            accountService.associateStock(accountId.toString(), dto);

            verify(accountStockRepository, times(1)).save(accountStockCaptor.capture());
            var saved = accountStockCaptor.getValue();
            assertEquals(100, saved.getQuantity());
            assertEquals(account, saved.getAccount());
            assertEquals(stock, saved.getStock());
        }

        @Test
        @DisplayName("Should throw ResourceNotFoundException when account does not exist")
        void shouldThrowWhenAccountNotFound() {
            var accountId = UUID.randomUUID();
            var dto = new AssociateAccountStock("PETR4", 100);

            doReturn(Optional.empty()).when(accountRepository).findById(accountId);

            assertThrows(ResourceNotFoundException.class, () -> accountService.associateStock(accountId.toString(), dto));
            verify(accountStockRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should throw ResourceNotFoundException when stock does not exist")
        void shouldThrowWhenStockNotFound() {
            var accountId = UUID.randomUUID();
            var account = new Account(accountId, null, null, "XP", new ArrayList<>());
            var dto = new AssociateAccountStock("UNKNOWN", 100);

            doReturn(Optional.of(account)).when(accountRepository).findById(accountId);
            doReturn(Optional.empty()).when(stockRepository).findById("UNKNOWN");

            assertThrows(ResourceNotFoundException.class, () -> accountService.associateStock(accountId.toString(), dto));
            verify(accountStockRepository, never()).save(any());
        }
    }

    @Nested
    class PortfolioValuation {

        @Test
        @DisplayName("Should calculate real-time portfolio valuation based on current stock prices")
        void shouldCalculatePortfolioValuation() {
            var accountId = UUID.randomUUID();
            var stock1 = new Stock("PETR4", "Petrobras PN");
            var stock2 = new Stock("VALE3", "Vale ON");

            var as1 = new AccountStock(new AccountStockId(accountId, "PETR4"), null, stock1, 100);
            var as2 = new AccountStock(new AccountStockId(accountId, "VALE3"), null, stock2, 50);

            var account = new Account(accountId, null, null, "Clear Broker", List.of(as1, as2));

            doReturn(Optional.of(account)).when(accountRepository).findById(accountId);
            doReturn(35.50).when(stockPriceService).getPrice("PETR4");
            doReturn(60.00).when(stockPriceService).getPrice("VALE3");

            var valuation = accountService.getAccountValuation(accountId.toString());

            assertNotNull(valuation);
            assertEquals(accountId.toString(), valuation.accountId());
            assertEquals("Clear Broker", valuation.description());
            assertEquals(2, valuation.positions().size());

            // 100 * 35.50 = 3550.00, 50 * 60.00 = 3000.00 -> Total = 6550.00
            assertEquals(6550.00, valuation.totalPortfolioValue());

            var petr4Pos = valuation.positions().stream().filter(p -> p.stockId().equals("PETR4")).findFirst().orElseThrow();
            assertEquals(100, petr4Pos.quantity());
            assertEquals(35.50, petr4Pos.currentPrice());
            assertEquals(3550.00, petr4Pos.total());
        }

        @Test
        @DisplayName("Should return list of stocks with real-time total values")
        void shouldListStocksWithLiveTotals() {
            var accountId = UUID.randomUUID();
            var stock = new Stock("ITUB4", "Itaú PN");
            var as = new AccountStock(new AccountStockId(accountId, "ITUB4"), null, stock, 200);
            var account = new Account(accountId, null, null, "Nubank", List.of(as));

            doReturn(Optional.of(account)).when(accountRepository).findById(accountId);
            doReturn(30.00).when(stockPriceService).getPrice("ITUB4");

            var list = accountService.ListStocks(accountId.toString());

            assertEquals(1, list.size());
            assertEquals("ITUB4", list.get(0).stockId());
            assertEquals(200, list.get(0).quantity());
            assertEquals(30.00, list.get(0).currentPrice());
            assertEquals(6000.00, list.get(0).total());
        }
    }
}
