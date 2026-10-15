package caio.buindrum.agregadordeinvestimentos.Controller;

import caio.buindrum.agregadordeinvestimentos.Controller.Dto.CreateStockDto;
import caio.buindrum.agregadordeinvestimentos.entity.Stock;
import caio.buindrum.agregadordeinvestimentos.exception.ApiErrorResponse;
import caio.buindrum.agregadordeinvestimentos.service.StockService;
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

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/v1/stocks")
@Tag(name = "Stocks", description = "Endpoints for managing the stock catalog and tickers")
public class StockController {

    private final StockService stockService;

    public StockController(StockService stockService) {
        this.stockService = stockService;
    }

    @PostMapping
    @Operation(summary = "Register a new stock", description = "Registers a new stock ticker in the system",
            security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Stock registered successfully"),
            @ApiResponse(responseCode = "400", description = "Validation failed",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(responseCode = "409", description = "Stock ticker already exists",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<Void> createStock(@Valid @RequestBody CreateStockDto createStockDto) {
        stockService.createStock(createStockDto);
        return ResponseEntity.created(URI.create("/v1/stocks/" + createStockDto.stockId().trim().toUpperCase())).build();
    }

    @GetMapping
    @Operation(summary = "List all registered stocks", description = "Retrieves all available stocks in the catalog",
            security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Stocks retrieved",
                    content = @Content(array = @ArraySchema(schema = @Schema(implementation = Stock.class)))),
            @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<List<Stock>> listStocks() {
        var stocks = stockService.listAllStocks();
        return ResponseEntity.ok(stocks);
    }

    @GetMapping("/{stockId}")
    @Operation(summary = "Get stock by ticker", description = "Retrieves details of a specific stock ticker",
            security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Stock found",
                    content = @Content(schema = @Schema(implementation = Stock.class))),
            @ApiResponse(responseCode = "401", description = "Unauthorized",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class))),
            @ApiResponse(responseCode = "404", description = "Stock not found",
                    content = @Content(schema = @Schema(implementation = ApiErrorResponse.class)))
    })
    public ResponseEntity<Stock> getStockById(@PathVariable("stockId") String stockId) {
        var stock = stockService.getStockById(stockId);
        return ResponseEntity.ok(stock);
    }
}
