package caio.buindrum.agregadordeinvestimentos.service;

import caio.buindrum.agregadordeinvestimentos.Controller.Dto.*;
import caio.buindrum.agregadordeinvestimentos.entity.Account;
import caio.buindrum.agregadordeinvestimentos.entity.BillingAddress;
import caio.buindrum.agregadordeinvestimentos.entity.User;
import caio.buindrum.agregadordeinvestimentos.exception.DuplicateResourceException;
import caio.buindrum.agregadordeinvestimentos.exception.ResourceNotFoundException;
import caio.buindrum.agregadordeinvestimentos.repository.AccountRepository;
import caio.buindrum.agregadordeinvestimentos.repository.BillingAddressRepository;
import caio.buindrum.agregadordeinvestimentos.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static java.util.Objects.isNull;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AccountRepository accountRepositoy;
    private final BillingAddressRepository billingAddressRepository;
    private final PasswordEncoder passwordEncoder;
    private final AccountService accountService;

    public UserService(UserRepository userRepository,
                       AccountRepository accountRepositoy,
                       BillingAddressRepository billingAddressRepository,
                       PasswordEncoder passwordEncoder,
                       AccountService accountService) {
        this.userRepository = userRepository;
        this.accountRepositoy = accountRepositoy;
        this.billingAddressRepository = billingAddressRepository;
        this.passwordEncoder = passwordEncoder;
        this.accountService = accountService;
    }

    @Transactional
    public UUID createUser(CreateUserDto createUserDto) {

        if (userRepository.existsByUsername(createUserDto.username())) {
            throw new DuplicateResourceException("Username is already taken");
        }

        if (userRepository.existsByEmail(createUserDto.email())) {
            throw new DuplicateResourceException("Email is already registered");
        }

        // DTO -> ENTITY with hashed password
        var entity = new User(
                UUID.randomUUID(),
                createUserDto.username(),
                createUserDto.email(),
                passwordEncoder.encode(createUserDto.password()),
                Instant.now(),
                null);

        var userSaved = userRepository.save(entity);

        return userSaved.getUserId();
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserById(String userId) {
        return userRepository.findById(UUID.fromString(userId));
    }

    @Transactional(readOnly = true)
    public List<User> listUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public void updateUserById(String userId, UpdateUserDto updateUserDto) {

        var id = UUID.fromString(userId);

        var userEntity = userRepository.findById(id);

        if (userEntity.isPresent()) {
            var user = userEntity.get();

            if (updateUserDto.username() != null && !updateUserDto.username().isBlank()) {
                user.setUsername(updateUserDto.username());
            }

            if (updateUserDto.password() != null && !updateUserDto.password().isBlank()) {
                user.setPassword(passwordEncoder.encode(updateUserDto.password()));
            }

            userRepository.save(user);
        }
    }

    @Transactional
    public void deleteById(String userId) {

        var id = UUID.fromString(userId);

        var userExists = userRepository.existsById(id);

        if (userExists) {
            userRepository.deleteById(id);
        }
    }

    @Transactional
    public void createAccount(String userId, CreateAccountDto createAccountDto) {

        var user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (isNull(user.getAccounts())) {
            user.setAccounts(new ArrayList<>());
        }

        // DTO -> ENTITY
        var account = new Account(
                null,
                user,
                null,
                createAccountDto.description(),
                new ArrayList<>()
        );

        var accountCreated = accountRepositoy.save(account);

        var billingAddress = new BillingAddress(
                null,
                accountCreated,
                createAccountDto.street(),
                createAccountDto.number()
        );

        billingAddressRepository.save(billingAddress);
    }

    @Transactional(readOnly = true)
    public List<Account> findAccounts(String userId) {
        var user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return user.getAccounts();
    }

    @Transactional(readOnly = true)
    public List<AccountResponseDto> ListAccounts(String userId) {
        var user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        return user.getAccounts().stream().map(ac -> new AccountResponseDto(ac.getAccountId().toString(), ac.getDescription())).toList();
    }

    @Transactional(readOnly = true)
    public UserValuationResponseDto getUserValuation(String userId) {
        var user = userRepository.findById(UUID.fromString(userId))
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        List<AccountValuationResponseDto> accountValuations = user.getAccounts().stream()
                .map(accountService::buildAccountValuation)
                .toList();

        double totalNetWorth = accountValuations.stream()
                .mapToDouble(AccountValuationResponseDto::totalPortfolioValue)
                .sum();

        return new UserValuationResponseDto(
                user.getUserId().toString(),
                user.getUsername(),
                Math.round(totalNetWorth * 100.0) / 100.0,
                accountValuations,
                Instant.now()
        );
    }
}