package caio.buindrum.agregadordeinvestimentos.Controller.Dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Payload to register a new user")
public record CreateUserDto(
    @Schema(description = "Username", example = "caio")
    @NotBlank(message = "Username cannot be empty")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    String username,

    @Schema(description = "User email address", example = "caio@email.com")
    @NotBlank(message = "Email cannot be empty")
    @Email(message = "Invalid email format")
    String email,

    @Schema(description = "Password (min 6 characters)", example = "secret123")
    @NotBlank(message = "Password cannot be empty")
    @Size(min = 6, max = 100, message = "Password must have at least 6 characters")
    String password
) {
}
