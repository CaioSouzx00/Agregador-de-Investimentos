package caio.buindrum.agregadordeinvestimentos.service;

import caio.buindrum.agregadordeinvestimentos.Controller.Dto.LoginRequestDto;
import caio.buindrum.agregadordeinvestimentos.entity.User;
import caio.buindrum.agregadordeinvestimentos.exception.InvalidCredentialsException;
import caio.buindrum.agregadordeinvestimentos.repository.UserRepository;
import caio.buindrum.agregadordeinvestimentos.security.JwtService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @InjectMocks
    private AuthService authService;

    @Test
    @DisplayName("Should successfully authenticate user and return JWT token")
    void shouldLoginSuccessfully() {
        var user = new User(UUID.randomUUID(), "caio", "caio@email.com", "hashedPassword", Instant.now(), null);
        var dto = new LoginRequestDto("caio@email.com", "secret123");

        doReturn(Optional.empty()).when(userRepository).findByUsername("caio@email.com");
        doReturn(Optional.of(user)).when(userRepository).findByEmail("caio@email.com");
        doReturn(true).when(passwordEncoder).matches("secret123", "hashedPassword");
        doReturn("mocked.jwt.token").when(jwtService).generateToken(eq("caio"), any());
        doReturn(86400000L).when(jwtService).getExpirationMs();

        var response = authService.login(dto);

        assertNotNull(response);
        assertEquals("mocked.jwt.token", response.accessToken());
        assertEquals("Bearer", response.tokenType());
        assertEquals(86400000L, response.expiresIn());
    }

    @Test
    @DisplayName("Should throw InvalidCredentialsException when password does not match")
    void shouldThrowWhenPasswordMismatch() {
        var user = new User(UUID.randomUUID(), "caio", "caio@email.com", "hashedPassword", Instant.now(), null);
        var dto = new LoginRequestDto("caio", "wrongPassword");

        doReturn(Optional.of(user)).when(userRepository).findByUsername("caio");
        doReturn(false).when(passwordEncoder).matches("wrongPassword", "hashedPassword");

        assertThrows(InvalidCredentialsException.class, () -> authService.login(dto));
        verify(jwtService, never()).generateToken(any(), any());
    }

    @Test
    @DisplayName("Should throw InvalidCredentialsException when user not found")
    void shouldThrowWhenUserNotFound() {
        var dto = new LoginRequestDto("nonexistent", "pass");

        doReturn(Optional.empty()).when(userRepository).findByUsername("nonexistent");
        doReturn(Optional.empty()).when(userRepository).findByEmail("nonexistent");

        assertThrows(InvalidCredentialsException.class, () -> authService.login(dto));
    }
}
