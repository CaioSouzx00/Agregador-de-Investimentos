package caio.buindrum.agregadordeinvestimentos.Controller.Dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Schema(description = "Payload to associate a stock position with an account")
public record AssociateAccountStock(
    @Schema(description = "Stock ticker symbol", example = "PETR4")
    @NotBlank(message = "Stock ID cannot be empty")
    String stockId,

    @Schema(description = "Quantity of shares", example = "50")
    @NotNull(message = "Quantity cannot be null")
    @Positive(message = "Quantity must be greater than zero")
    int quantity
) {
}
