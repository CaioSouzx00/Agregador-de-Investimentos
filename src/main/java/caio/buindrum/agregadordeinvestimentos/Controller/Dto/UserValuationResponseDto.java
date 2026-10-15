package caio.buindrum.agregadordeinvestimentos.Controller.Dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.List;

@Schema(description = "Aggregated portfolio valuation across all user investment accounts")
public record UserValuationResponseDto(
    @Schema(description = "User unique ID", example = "123e4567-e89b-12d3-a456-426614174000")
    String userId,

    @Schema(description = "User handle / username", example = "caio")
    String username,

    @Schema(description = "Total aggregated portfolio valuation across all accounts", example = "45250.75")
    double totalNetWorth,

    @Schema(description = "Valuation breakdown per investment account")
    List<AccountValuationResponseDto> accounts,

    @Schema(description = "Timestamp when valuation was calculated")
    Instant evaluatedAt
) {
}
