package com.auth.auth.integration;

import com.auth.auth.dtos.LoginRequest;
import com.auth.auth.dtos.RegisterRequest;
import com.auth.auth.model.Role;
import com.auth.auth.model.User;
import com.auth.auth.model.UserPrincipal;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.UUID;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class UserAuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    

    @BeforeEach
    void setup() {
        // This method can be used to set up any common test data or configurations
        // if needed before each test runs.
    }

    @Test
    void testLoginAndGetCurrentUser() throws Exception {
        // 1. Register a user
        RegisterRequest register = new RegisterRequest();
        register.setUsername("authuser");
        register.setPassword("securepass");
        register.setEmail("authuser@example.com");
        register.setRole(Role.ADMIN);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(register)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered"));

        // 2. Login to get JWT token
        LoginRequest login = new LoginRequest();
        login.setUsername("authuser");
        login.setPassword("securepass");

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andReturn();

        String jsonResponse = loginResult.getResponse().getContentAsString();
        String token = objectMapper.readTree(jsonResponse).get("token").asText();
        assertThat(token).isNotBlank();

        // 3. Call /current-user with Bearer token
        mockMvc.perform(get("/api/auth/current-user")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("authuser"))
                .andExpect(jsonPath("$.email").value("authuser@example.com"));
    }

    @Test
    void testCurrentUserWithoutTokenShouldFail() throws Exception {

        mockMvc.perform(get("/current-user"))
                .andExpect(status().isUnauthorized());
    }
    @Test
void testLoginWithWrongPassword() throws Exception {
    // First, register a user
    RegisterRequest register = new RegisterRequest();
    register.setUsername("wrongpassuser");
    register.setPassword("correctpass");
    register.setEmail("wrongpass@example.com");
    register.setRole(Role.ADMIN);

    mockMvc.perform(post("/api/auth/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(register)))
            .andExpect(status().isOk());

    // Now attempt login with incorrect password
    LoginRequest login = new LoginRequest();
    login.setUsername("wrongpassuser");
    login.setPassword("wrongpass");

    mockMvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(login)))
            .andExpect(status().isUnauthorized())
            .andExpect(jsonPath("$.message").value("Invalid Credentials"));
}

@Test
void testLoginWithMissingFields() throws Exception {
    // Empty login object
    LoginRequest login = new LoginRequest();

    mockMvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(login)))
            .andExpect(status().isBadRequest()); // If @Valid is applied
}
@Test
void testAdminEndpointWithAdminRole() throws Exception {
    // Register an admin user
    RegisterRequest register = new RegisterRequest();
    register.setUsername("adminuser");
    register.setPassword("adminpass");
    register.setEmail("admin@example.com");
    register.setRole(Role.ADMIN);

    mockMvc.perform(post("/api/auth/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(register)))
            .andExpect(status().isOk());

    LoginRequest login = new LoginRequest();
    login.setUsername("adminuser");
    login.setPassword("adminpass");

    MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(login)))
            .andExpect(status().isOk())
            .andReturn();

    String token = objectMapper.readTree(loginResult.getResponse().getContentAsString()).get("token").asText();

    mockMvc.perform(get("/api/auth/admin-only")
            .header("Authorization", "Bearer " + token))
            .andExpect(status().isOk())
            .andExpect(content().string("Welcome, Admin!"));
}

@Test
void testAdminEndpointWithUserRole_shouldFail() throws Exception {
    // Register regular user
    RegisterRequest register = new RegisterRequest();
    register.setUsername("useronly");
    register.setPassword("userpass");
    register.setEmail("useronly@example.com");
    register.setRole(Role.USER);

    mockMvc.perform(post("/api/auth/register")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(register)))
            .andExpect(status().isOk());

    LoginRequest login = new LoginRequest();
    login.setUsername("useronly");
    login.setPassword("userpass");

    MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
            .contentType(MediaType.APPLICATION_JSON)
            .content(objectMapper.writeValueAsString(login)))
            .andExpect(status().isOk())
            .andReturn();

    String token = objectMapper.readTree(loginResult.getResponse().getContentAsString()).get("token").asText();

    mockMvc.perform(get("/api/auth/admin-only")
            .header("Authorization", "Bearer " + token))
            .andExpect(status().isForbidden());
}
@Test
void mockCurrentUserWithoutJWT() {
    User mockUser = new User(UUID.randomUUID(), "mock", "pass", "mock@email.com", Role.ADMIN);
    UserPrincipal mockPrincipal = new UserPrincipal(mockUser);

    SecurityContext context = SecurityContextHolder.createEmptyContext();
    context.setAuthentication(new UsernamePasswordAuthenticationToken(mockPrincipal, null, mockPrincipal.getAuthorities()));
    SecurityContextHolder.setContext(context);

    // Call method under test here
}

}
