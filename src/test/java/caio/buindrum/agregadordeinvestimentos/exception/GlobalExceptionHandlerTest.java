package caio.buindrum.agregadordeinvestimentos.exception;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();

    @Test
    @DisplayName("Should handle MethodArgumentNotValidException and return 400 with details")
    void shouldHandleValidationException() {
        var request = new MockHttpServletRequest();
        request.setRequestURI("/v1/users");

        var bindingResult = mock(BindingResult.class);
        var fieldError = new FieldError("createUserDto", "email", "invalid", false, null, null, "Invalid email format");
        doReturn(List.of(fieldError)).when(bindingResult).getFieldErrors();

        var ex = new MethodArgumentNotValidException(null, bindingResult);

        var response = handler.handleValidationException(ex, request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(400, response.getBody().status());
        assertEquals("/v1/users", response.getBody().path());
        assertEquals(1, response.getBody().validationErrors().size());
        assertEquals("email", response.getBody().validationErrors().get(0).field());
        assertEquals("Invalid email format", response.getBody().validationErrors().get(0).message());
    }

    @Test
    @DisplayName("Should handle ResourceNotFoundException and return 404")
    void shouldHandleResourceNotFoundException() {
        var request = new MockHttpServletRequest();
        request.setRequestURI("/v1/users/123");

        var ex = new ResourceNotFoundException("User not found");
        var response = handler.handleResourceNotFoundException(ex, request);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(404, response.getBody().status());
        assertEquals("User not found", response.getBody().message());
    }

    @Test
    @DisplayName("Should handle DuplicateResourceException and return 409")
    void shouldHandleDuplicateResourceException() {
        var request = new MockHttpServletRequest();
        request.setRequestURI("/v1/stocks");

        var ex = new DuplicateResourceException("Stock already exists");
        var response = handler.handleDuplicateResourceException(ex, request);

        assertEquals(HttpStatus.CONFLICT, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(409, response.getBody().status());
        assertEquals("Stock already exists", response.getBody().message());
    }

    @Test
    @DisplayName("Should handle ResponseStatusException and return matching status")
    void shouldHandleResponseStatusException() {
        var request = new MockHttpServletRequest();
        request.setRequestURI("/v1/accounts/123");

        var ex = new ResponseStatusException(HttpStatus.NOT_FOUND, "Account does not exist");
        var response = handler.handleResponseStatusException(ex, request);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(404, response.getBody().status());
    }

    @Test
    @DisplayName("Should handle unhandled exceptions and return 500")
    void shouldHandleGeneralException() {
        var request = new MockHttpServletRequest();
        request.setRequestURI("/v1/test");

        var ex = new RuntimeException("Unexpected db crash");
        var response = handler.handleGeneralException(ex, request);

        assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(500, response.getBody().status());
    }
}
