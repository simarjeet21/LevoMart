package com.auth.auth.unit.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.UUID;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.util.ReflectionTestUtils;

import com.auth.auth.model.Role;
import com.auth.auth.model.User;
import com.auth.auth.model.UserPrincipal;
import com.auth.auth.service.JwtService;

@ActiveProfiles("test")
public class JwtServiceTest {
    private JwtService jwtService;

    @BeforeEach
    public void setUp() {
        // Initialize the JwtService with necessary dependencies
        jwtService = new JwtService();
        // You can mock dependencies here if needed, e.g., using Mockito
        ReflectionTestUtils.setField(jwtService, "secretKey", "TmV3U2VjcmV0S2V5Rm9ySldUU2lnbmluZ1B1cnBvc2VzMTIzNDU2Nzg=");
    }

    @Test
    public void testGenerateAndValidateToken() {

        // Generate a token
        User user = new User();
        user.setUserId(UUID.randomUUID());
        user.setUsername("testuser");
        user.setPassword("testpassword");
        user.setEmail("test@example.com");
        user.setRole(Role.USER);

        UserPrincipal userPrincipal = new UserPrincipal(user);
        // token generated
        String token = jwtService.generateToken(userPrincipal);
        assertNotNull(token, "Token should not be null");

        //extract user details from the token
        String extractedUsername = jwtService.extractUserName(token);
        assertEquals("testuser", extractedUsername, "Extracted username should match the original username");

        assertTrue(jwtService.validateToken(token, userPrincipal));

    }

}
