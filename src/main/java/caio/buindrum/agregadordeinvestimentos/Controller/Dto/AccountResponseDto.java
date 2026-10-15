package caio.buindrum.agregadordeinvestimentos.Controller.Dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Account summary representation")
public record AccountResponseDto(
    @Schema(description = "Account ID", example = "123e4567-e89b-12d3-a456-426614174000")
    String accountId,

    @Schema(description = "Account description / broker", example = "XP Investment Account")
    String description
) {
}
