package caio.buindrum.agregadordeinvestimentos.Controller.Dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "User summary representation")
public record UserResponseDto(
    @Schema(description = "User unique ID (UUID)", example = "123e4567-e89b-12d3-a456-426614174000")
    String userId,

    @Schema(description = "User handle / name", example = "caio")
    String username,

    @Schema(description = "User registered email", example = "caio@email.com")
    String email
) {
}
