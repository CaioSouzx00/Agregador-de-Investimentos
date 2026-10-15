package caio.buindrum.agregadordeinvestimentos.Controller.Dto;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "User authentication response with JWT access token")
public record LoginResponseDto(
    @Schema(description = "JWT Bearer access token")
    String accessToken,

    @Schema(description = "Token type", example = "Bearer")
    String tokenType,

    @Schema(description = "Token expiration time in milliseconds", example = "86400000")
    long expiresIn
) {
}
