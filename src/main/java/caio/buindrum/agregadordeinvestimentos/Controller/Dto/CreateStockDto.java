package caio.buindrum.agregadordeinvestimentos.Controller.Dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Schema(description = "Payload to register a new stock ticker")
public record CreateStockDto(
    @Schema(description = "Stock symbol/ticker", example = "PETR4")
    @NotBlank(message = "Stock ID cannot be empty")
    @Pattern(regexp = "^[A-Za-z0-9]{3,10}$", message = "Stock ID must be alphanumeric and between 3 to 10 characters")
    String stockId,

    @Schema(description = "Stock description / company name", example = "Petrobras PN")
    @NotBlank(message = "Description cannot be empty")
    String description
) {
}
