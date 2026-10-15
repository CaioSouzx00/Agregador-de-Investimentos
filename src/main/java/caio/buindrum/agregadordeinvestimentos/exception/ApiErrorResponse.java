package caio.buindrum.agregadordeinvestimentos.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
@Schema(description = "Standard API error response format")
public record ApiErrorResponse(
    @Schema(description = "Error timestamp")
    Instant timestamp,

    @Schema(description = "HTTP status code", example = "400")
    int status,

    @Schema(description = "HTTP error title", example = "Bad Request")
    String error,

    @Schema(description = "Human-readable error summary", example = "Validation failed for request object")
    String message,

    @Schema(description = "Requested resource path", example = "/v1/users")
    String path,

    @Schema(description = "List of specific field validation errors, if applicable")
    List<ValidationErrorDetail> validationErrors
) {
    public static ApiErrorResponse of(int status, String error, String message, String path) {
        return new ApiErrorResponse(Instant.now(), status, error, message, path, null);
    }

    public static ApiErrorResponse of(int status, String error, String message, String path, List<ValidationErrorDetail> errors) {
        return new ApiErrorResponse(Instant.now(), status, error, message, path, errors);
    }
}
