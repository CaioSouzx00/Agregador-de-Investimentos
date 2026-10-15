package caio.buindrum.agregadordeinvestimentos.Controller.Dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Stock position within an investment account")
public record AccountStockResponseDto(
    @Schema(description = "Stock ticker symbol", example = "PETR4")
    String stockId,

    @Schema(description = "Quantity of shares held", example = "50")
    Integer quantity,

    @Schema(description = "Current market price per share", example = "38.50")
    double currentPrice,

    @Schema(description = "Total position value (quantity * currentPrice)", example = "1925.00")
    double total
) {
    public AccountStockResponseDto(String stockId, Integer quantity, double total) {
        this(stockId, quantity, 0.0, total);
    }
}
