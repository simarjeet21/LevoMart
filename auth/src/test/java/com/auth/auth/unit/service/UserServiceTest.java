package com.auth.auth.unit.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.context.annotation.Import;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import com.auth.auth.dao.UserRepo;
import com.auth.auth.model.Role;
import com.auth.auth.model.User;
import com.auth.auth.service.UserService;

@ActiveProfiles("test")
public class UserServiceTest {

    @Mock
    private UserRepo userRepo;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @BeforeEach
    public void setUp() {
        // Initialize mocks and inject them into the userService
        // This can be done using Mockito annotations or a testing framework like JUnit
        // For example, using Mockito:
         MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testSaveUser_encodesPassword() {
        // Create a user object with a plain text password
        User inputUser = new User();
        inputUser.setUsername("testuser");
        inputUser.setPassword("plaintextpassword");
        inputUser.setEmail("test@example.com");
        inputUser.setRole(Role.USER);



        // Mock the behavior of the password encoder
        String encodedPassword = "encodedpassword";
        when(passwordEncoder.encode(inputUser.getPassword())).thenReturn(encodedPassword);

        User savedUser = new User();
        savedUser.setUsername("testuser");
        savedUser.setPassword(encodedPassword);
        savedUser.setEmail("test@email.com");
        savedUser.setRole(Role.USER);

        when(userRepo.save(any(User.class))).thenReturn(savedUser);

        User result = userService.saveUser(inputUser);

        assertNotNull(result);
        assertEquals(encodedPassword, result.getPassword());
        verify(passwordEncoder, times(1)).encode("plaintextpassword");
        verify(userRepo, times(1)).save(any(User.class));
    }

}
