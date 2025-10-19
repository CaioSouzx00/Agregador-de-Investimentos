package caio.buindrum.agregadordeinvestimentos.Controller;


import caio.buindrum.agregadordeinvestimentos.Controller.Dto.AccountStockResponseDto;
import caio.buindrum.agregadordeinvestimentos.Controller.Dto.AssociateAccountStock;
import caio.buindrum.agregadordeinvestimentos.service.AccountService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/accounts")
public class AccountController {

    private AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping("/{accountId}/stock")
    public ResponseEntity<Void> createAccount(@PathVariable("accountId") String accountId, @RequestBody AssociateAccountStock associateAccountStock) {
        accountService.associateStock(accountId, associateAccountStock);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{accountId}/stock")
    public ResponseEntity<List<AccountStockResponseDto>> createAccount(@PathVariable("accountId") String accountId){
        var stocks = accountService.ListStocks(accountId);
        return ResponseEntity.ok(stocks);
    }

}
