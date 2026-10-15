package caio.buindrum.agregadordeinvestimentos.Controller.Dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;

@Schema(description = "Payload to update an existing user")
public record UpdateUserDto(
    @Schema(description = "New username", example = "caio_updated")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    String username,

    @Schema(description = "New password", example = "newSecret123")
    @Size(min = 6, max = 100, message = "Password must have at least 6 characters")
    String password
) {
}
