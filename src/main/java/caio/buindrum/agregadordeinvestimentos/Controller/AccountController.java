package caio.buindrum.agregadordeinvestimentos.Controller;

import caio.buindrum.agregadordeinvestimentos.Controller.Dto.AccountStockResponseDto;
import caio.buindrum.agregadordeinvestimentos.Controller.Dto.AccountValuationResponseDto;
import caio.buindrum.agregadordeinvestimentos.Controller.Dto.AssociateAccountStock;
import caio.buindrum.agregadordeinvestimentos.exception.ApiErrorResponse;
import caio.buindrum.agregadordeinvestimentos.service.AccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/accounts")
@Tag(name = "Accounts", description = "Endpoints for managing investment accounts, stock positions, and live portfolio valuations")
public class AccountController {

    private final AccountService accountService;

    public AccountController(AccountService accountService) {
        this.accountService = accountService;
    }

    @PostMapping("/{accountId}/stocks")
    @Operation(summary = "Associate stock position", description = "Adds or updates a stock position for an investment account within a transactional boundary",
            security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Stock position associated successfully"),
            @ApiResponse(responseCode = "400", description = "Validation failed",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Account or stock not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<Void> associateStock(@PathVariable("accountId") String accountId,
                                              @Valid @RequestBody AssociateAccountStock associateAccountStock) {
        accountService.associateStock(accountId, associateAccountStock);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{accountId}/stocks")
    @Operation(summary = "List account stock positions", description = "Retrieves all stock positions for an account with current real-time prices and position totals",
            security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Stock positions retrieved",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = AccountStockResponseDto.class)))),
            @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Account not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<List<AccountStockResponseDto>> listStocks(@PathVariable("accountId") String accountId) {
        var stocks = accountService.ListStocks(accountId);
        return ResponseEntity.ok(stocks);
    }

    @GetMapping("/{accountId}/valuation")
    @Operation(summary = "Get account portfolio valuation", description = "Calculates the real-time total valuation of an account based on current stock market prices",
            security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Portfolio valuation calculated successfully",
                    content = @Content(schema = @Schema(implementation = AccountValuationResponseDto.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Account not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<AccountValuationResponseDto> getAccountValuation(@PathVariable("accountId") String accountId) {
        var valuation = accountService.getAccountValuation(accountId);
        return ResponseEntity.ok(valuation);
    }
}
