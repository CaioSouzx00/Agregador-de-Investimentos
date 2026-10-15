package caio.buindrum.agregadordeinvestimentos.service;

import caio.buindrum.agregadordeinvestimentos.Controller.Dto.LoginRequestDto;
import caio.buindrum.agregadordeinvestimentos.Controller.Dto.LoginResponseDto;
import caio.buindrum.agregadordeinvestimentos.exception.InvalidCredentialsException;
import caio.buindrum.agregadordeinvestimentos.repository.UserRepository;
import caio.buindrum.agregadordeinvestimentos.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional(readOnly = true)
    public LoginResponseDto login(LoginRequestDto loginRequestDto) {
        var user = userRepository.findByUsername(loginRequestDto.usernameOrEmail())
                .or(() -> userRepository.findByEmail(loginRequestDto.usernameOrEmail()))
                .orElseThrow(() -> new InvalidCredentialsException("Invalid username or password"));

        if (!passwordEncoder.matches(loginRequestDto.password(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid username or password");
        }

        var token = jwtService.generateToken(
                user.getUsername(),
                Map.of(
                        "userId", user.getUserId().toString(),
                        "email", user.getEmail()
                )
        );

        return new LoginResponseDto(token, "Bearer", jwtService.getExpirationMs());
    }
}
