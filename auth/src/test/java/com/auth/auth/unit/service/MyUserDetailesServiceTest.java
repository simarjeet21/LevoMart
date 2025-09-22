package com.auth.auth.unit.service;

import com.auth.auth.dao.UserRepo;
import com.auth.auth.model.Role;
import com.auth.auth.model.User;
import com.auth.auth.model.UserPrincipal;
import com.auth.auth.service.MyUserDetailesService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.context.annotation.Import;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ActiveProfiles("test")
public class MyUserDetailesServiceTest{

    @Mock
    private UserRepo userRepo;

    @InjectMocks
    private MyUserDetailesService userDetailsService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testLoadUserByUsername_userExists_returnsUserDetails() {
        User mockUser = new User();
        mockUser.setUsername("testuser");
        mockUser.setPassword("encodedpassword");
        mockUser.setRole(Role.USER);

        when(userRepo.findByUsername("testuser")).thenReturn(mockUser);

        UserDetails userDetails = userDetailsService.loadUserByUsername("testuser");

        assertNotNull(userDetails);
        assertEquals("testuser", userDetails.getUsername());
    }

    @Test
    public void testLoadUserByUsername_userNotFound_throwsException() {
        when(userRepo.findByUsername("unknown")).thenReturn(null);

        assertThrows(UsernameNotFoundException.class, () -> {
            userDetailsService.loadUserByUsername("unknown");
        });
    }
}
