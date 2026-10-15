package caio.buindrum.agregadordeinvestimentos.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.userdetails.User;
import org.springframework.test.util.ReflectionTestUtils;

import java.util.Collections;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService();
        // 256-bit secret key for testing
        ReflectionTestUtils.setField(jwtService, "secretKey", "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970");
        ReflectionTestUtils.setField(jwtService, "jwtExpirationMs", 3600000L);
    }

    @Test
    @DisplayName("Should generate valid token and extract username")
    void shouldGenerateAndExtractUsername() {
        var token = jwtService.generateToken("caio_investor", Map.of("role", "ROLE_USER"));

        assertNotNull(token);
        assertTrue(jwtService.validateToken(token));

        var username = jwtService.extractUsername(token);
        assertEquals("caio_investor", username);
    }

    @Test
    @DisplayName("Should validate token against UserDetails")
    void shouldValidateAgainstUserDetails() {
        var userDetails = new User("caio", "pass", Collections.emptyList());
        var token = jwtService.generateToken("caio");

        assertTrue(jwtService.isTokenValid(token, userDetails));

        var otherUser = new User("other", "pass", Collections.emptyList());
        assertFalse(jwtService.isTokenValid(token, otherUser));
    }

    @Test
    @DisplayName("Should return false for malformed token")
    void shouldReturnFalseForMalformedToken() {
        assertFalse(jwtService.validateToken("invalid.malformed.token"));
    }
}
