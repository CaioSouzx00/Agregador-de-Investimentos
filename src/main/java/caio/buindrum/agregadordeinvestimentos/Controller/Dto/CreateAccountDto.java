package caio.buindrum.agregadordeinvestimentos.Controller.Dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Schema(description = "Payload to create a new investment account")
public record CreateAccountDto(
    @Schema(description = "Account description or broker name", example = "XP Investment Account")
    @NotBlank(message = "Description cannot be empty")
    String description,

    @Schema(description = "Billing address street", example = "Avenida Paulista")
    @NotBlank(message = "Street cannot be empty")
    String street,

    @Schema(description = "Billing address number", example = "1000")
    @NotNull(message = "Number cannot be null")
    @Positive(message = "Number must be greater than zero")
    Integer number
) {
}