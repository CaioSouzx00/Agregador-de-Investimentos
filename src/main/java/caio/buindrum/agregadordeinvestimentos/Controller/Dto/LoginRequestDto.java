package caio.buindrum.agregadordeinvestimentos.Controller.Dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "User authentication request")
public record LoginRequestDto(
    @Schema(description = "Username or email address", example = "caio@email.com")
    @NotBlank(message = "Username or email is required")
    String usernameOrEmail,

    @Schema(description = "Account password", example = "secret123")
    @NotBlank(message = "Password is required")
    String password
) {
}
