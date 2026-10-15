package caio.buindrum.agregadordeinvestimentos.service;

import caio.buindrum.agregadordeinvestimentos.Controller.Dto.CreateAccountDto;
import caio.buindrum.agregadordeinvestimentos.Controller.Dto.CreateUserDto;
import caio.buindrum.agregadordeinvestimentos.Controller.Dto.UpdateUserDto;
import caio.buindrum.agregadordeinvestimentos.entity.Account;
import caio.buindrum.agregadordeinvestimentos.entity.BillingAddress;
import caio.buindrum.agregadordeinvestimentos.entity.User;
import caio.buindrum.agregadordeinvestimentos.exception.DuplicateResourceException;
import caio.buindrum.agregadordeinvestimentos.exception.ResourceNotFoundException;
import caio.buindrum.agregadordeinvestimentos.repository.AccountRepository;
import caio.buindrum.agregadordeinvestimentos.repository.BillingAddressRepository;
import caio.buindrum.agregadordeinvestimentos.repository.UserRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private AccountRepository accountRepository;

    @Mock
    private BillingAddressRepository billingAddressRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private AccountService accountService;

    @InjectMocks
    private UserService userService;

    @Captor
    private ArgumentCaptor<User> userArgumentCaptor;

    @Captor
    private ArgumentCaptor<UUID> uuidArgumentCaptor;

    @Captor
    private ArgumentCaptor<Account> accountArgumentCaptor;

    @Captor
    private ArgumentCaptor<BillingAddress> billingAddressArgumentCaptor;

    @Nested
    class createUser {

        @Test
        @DisplayName("Should create a user with success and hashed password")
        void shouldCreateAUserWithSuccess() {

            // Arrange
            var user = new User(
                    UUID.randomUUID(),
                    "username",
                    "email@email.com",
                    "encodedPassword123",
                    Instant.now(),
                    null
            );

            var input = new CreateUserDto(
                    "username",
                    "email@email.com",
                    "rawPassword123"
            );

            doReturn(false).when(userRepository).existsByUsername(input.username());
            doReturn(false).when(userRepository).existsByEmail(input.email());
            doReturn("encodedPassword123").when(passwordEncoder).encode(input.password());
            doReturn(user).when(userRepository).save(userArgumentCaptor.capture());

            // Act
            var output = userService.createUser(input);

            // Assert
            assertNotNull(output);

            var userCaptured = userArgumentCaptor.getValue();

            assertEquals(input.username(), userCaptured.getUsername());
            assertEquals(input.email(), userCaptured.getEmail());
            assertEquals("encodedPassword123", userCaptured.getPassword());
            verify(passwordEncoder, times(1)).encode(input.password());
        }

        @Test
        @DisplayName("Should throw DuplicateResourceException when username is taken")
        void shouldThrowExceptionWhenUsernameAlreadyExists() {
            var input = new CreateUserDto("existingUser", "email@email.com", "pass123");
            doReturn(true).when(userRepository).existsByUsername("existingUser");

            assertThrows(DuplicateResourceException.class, () -> userService.createUser(input));
            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should throw DuplicateResourceException when email is registered")
        void shouldThrowExceptionWhenEmailAlreadyExists() {
            var input = new CreateUserDto("newUser", "existing@email.com", "pass123");
            doReturn(false).when(userRepository).existsByUsername("newUser");
            doReturn(true).when(userRepository).existsByEmail("existing@email.com");

            assertThrows(DuplicateResourceException.class, () -> userService.createUser(input));
            verify(userRepository, never()).save(any());
        }

        @Test
        @DisplayName("Should throw exception when repository save error occurs")
        void shouldThrowExceptionErrorOccurs() {

            // Arrange
            var input = new CreateUserDto(
                    "username",
                    "email@email.com",
                    "123456"
            );
            doReturn(false).when(userRepository).existsByUsername(input.username());
            doReturn(false).when(userRepository).existsByEmail(input.email());
            doReturn("encoded").when(passwordEncoder).encode(input.password());
            doThrow(new RuntimeException()).when(userRepository).save(any());

            // Act & Assert
            assertThrows(RuntimeException.class, () -> userService.createUser(input));
        }
    }

    @Nested
    class getUserById {

        @Test
        @DisplayName("Should get user by id with success when optional is present")
        void shouldGetUserByIdWithSuccessWhenOptionalIsPresent() {

            var user = new User(
                    UUID.randomUUID(),
                    "username",
                    "email@email.com",
                    "password",
                    Instant.now(),
                    null
            );
            doReturn(Optional.of(user)).when(userRepository).findById(uuidArgumentCaptor.capture());

            var output = userService.getUserById(user.getUserId().toString());

            assertTrue(output.isPresent());
            assertEquals(user.getUserId(), uuidArgumentCaptor.getValue());
        }

        @Test
        @DisplayName("Should get user by id with success when optional is empty")
        void shouldGetUserByIdWithSuccessWhenOptionalIsEmpty() {

            var userId = UUID.randomUUID();
            doReturn(Optional.empty()).when(userRepository).findById(uuidArgumentCaptor.capture());

            var output = userService.getUserById(userId.toString());

            assertTrue(output.isEmpty());
            assertEquals(userId, uuidArgumentCaptor.getValue());
        }
    }

    @Nested
    class ListUsers {

        @Test
        @DisplayName("Should return all users with success")
        void shouldReturnAllUsersWithSuccess() {

            var user = new User(
                    UUID.randomUUID(),
                    "username",
                    "email@email.com",
                    "password",
                    Instant.now(),
                    null
            );
            var userList = List.of(user);
            doReturn(userList).when(userRepository).findAll();

            var output = userService.listUsers();

            assertNotNull(output);
            assertEquals(userList.size(), output.size());
        }
    }

    @Nested
    class deleteById {

        @Test
        @DisplayName("Should delete user with success when user exists")
        void shouldDeleteUserWithSuccessWhenUserExists() {

            doReturn(true).when(userRepository).existsById(uuidArgumentCaptor.capture());
            doNothing().when(userRepository).deleteById(uuidArgumentCaptor.capture());
            var userId = UUID.randomUUID();

            userService.deleteById(userId.toString());

            var idList = uuidArgumentCaptor.getAllValues();
            assertEquals(userId, idList.get(0));
            assertEquals(userId, idList.get(1));

            verify(userRepository, times(1)).existsById(idList.get(0));
            verify(userRepository, times(1)).deleteById(idList.get(1));
        }

        @Test
        @DisplayName("Should not delete user when user NOT exists")
        void shouldNotDeleteUserWhenUserNotExists() {

            doReturn(false).when(userRepository).existsById(uuidArgumentCaptor.capture());
            var userId = UUID.randomUUID();

            userService.deleteById(userId.toString());

            assertEquals(userId, uuidArgumentCaptor.getValue());

            verify(userRepository, times(1)).existsById(uuidArgumentCaptor.getValue());
            verify(userRepository, never()).deleteById(any());
        }
    }

    @Nested
    class updateUserById {

        @Test
        @DisplayName("Should update user by id and encode password when provided")
        void shouldUpdateUserByIdWhenUserExistsAndUsernameAndPasswordIsFilled() {

            var updateUserDto = new UpdateUserDto(
                    "newUsername",
                    "newPassword123"
            );
            var user = new User(
                    UUID.randomUUID(),
                    "username",
                    "email@email.com",
                    "oldPassword",
                    Instant.now(),
                    null
            );
            doReturn(Optional.of(user)).when(userRepository).findById(uuidArgumentCaptor.capture());
            doReturn("hashedNewPassword").when(passwordEncoder).encode("newPassword123");
            doReturn(user).when(userRepository).save(userArgumentCaptor.capture());

            userService.updateUserById(user.getUserId().toString(), updateUserDto);

            assertEquals(user.getUserId(), uuidArgumentCaptor.getValue());

            var userCaptured = userArgumentCaptor.getValue();

            assertEquals(updateUserDto.username(), userCaptured.getUsername());
            assertEquals("hashedNewPassword", userCaptured.getPassword());

            verify(userRepository, times(1)).findById(uuidArgumentCaptor.getValue());
            verify(userRepository, times(1)).save(user);
            verify(passwordEncoder, times(1)).encode("newPassword123");
        }

        @Test
        @DisplayName("Should not update user when user not exists")
        void shouldNotUpdateUserWhenUserNotExists() {

            var updateUserDto = new UpdateUserDto(
                    "newUsername",
                    "newPassword"
            );
            var userId = UUID.randomUUID();
            doReturn(Optional.empty()).when(userRepository).findById(uuidArgumentCaptor.capture());

            userService.updateUserById(userId.toString(), updateUserDto);

            assertEquals(userId, uuidArgumentCaptor.getValue());

            verify(userRepository, times(1)).findById(uuidArgumentCaptor.getValue());
            verify(userRepository, never()).save(any());
        }
    }

    @Nested
    class createAccount {

        @Test
        @DisplayName("Should create account and billing address inside transaction")
        void shouldCreateAccountSuccessfully() {
            var userId = UUID.randomUUID();
            var user = new User(userId, "caio", "caio@email.com", "pass", Instant.now(), null);
            user.setAccounts(new ArrayList<>());

            var dto = new CreateAccountDto("XP Investment", "Rua A", 123);

            var createdAccount = new Account(UUID.randomUUID(), user, null, dto.description(), new ArrayList<>());

            doReturn(Optional.of(user)).when(userRepository).findById(userId);
            doReturn(createdAccount).when(accountRepository).save(accountArgumentCaptor.capture());
            doReturn(new BillingAddress()).when(billingAddressRepository).save(billingAddressArgumentCaptor.capture());

            userService.createAccount(userId.toString(), dto);

            var capturedAccount = accountArgumentCaptor.getValue();
            var capturedAddress = billingAddressArgumentCaptor.getValue();

            assertEquals(dto.description(), capturedAccount.getDescription());
            assertEquals(user, capturedAccount.getUser());
            assertEquals(dto.street(), capturedAddress.getStreet());
            assertEquals(dto.number(), capturedAddress.getNumber());
            assertEquals(createdAccount, capturedAddress.getAccount());

            verify(accountRepository, times(1)).save(any());
            verify(billingAddressRepository, times(1)).save(any());
        }

        @Test
        @DisplayName("Should throw ResourceNotFoundException when user does not exist")
        void shouldThrowWhenUserNotFound() {
            var userId = UUID.randomUUID();
            var dto = new CreateAccountDto("XP Investment", "Rua A", 123);
            doReturn(Optional.empty()).when(userRepository).findById(userId);

            assertThrows(ResourceNotFoundException.class, () -> userService.createAccount(userId.toString(), dto));
            verify(accountRepository, never()).save(any());
            verify(billingAddressRepository, never()).save(any());
        }
    }
}