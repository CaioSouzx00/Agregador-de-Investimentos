package caio.buindrum.agregadordeinvestimentos.exception;

import io.swagger.v3.oas.annotations.media.Schema;

@Schema(description = "Details about a field validation error")
public record ValidationErrorDetail(
    @Schema(description = "Name of the invalid field", example = "email")
    String field,

    @Schema(description = "Validation failure message", example = "Invalid email format")
    String message,

    @Schema(description = "The rejected value", example = "invalid-email")
    Object rejectedValue
) {
}
