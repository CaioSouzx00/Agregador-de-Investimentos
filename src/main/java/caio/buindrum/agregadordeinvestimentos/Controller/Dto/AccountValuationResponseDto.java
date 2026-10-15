package caio.buindrum.agregadordeinvestimentos.Controller.Dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.List;

@Schema(description = "Real-time valuation of an investment account portfolio")
public record AccountValuationResponseDto(
    @Schema(description = "Account ID", example = "123e4567-e89b-12d3-a456-426614174000")
    String accountId,

    @Schema(description = "Account description", example = "XP Investment Account")
    String description,

    @Schema(description = "Total market value of all positions in the account", example = "15420.50")
    double totalPortfolioValue,

    @Schema(description = "List of stock positions with live valuation")
    List<AccountStockResponseDto> positions,

    @Schema(description = "Timestamp when valuation was calculated")
    Instant evaluatedAt
) {
}
