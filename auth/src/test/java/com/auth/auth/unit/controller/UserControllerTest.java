    package com.auth.auth.unit.controller;

    import com.auth.auth.config.JwtFilter;
    import com.auth.auth.controller.UserController;
    import com.auth.auth.dtos.AuthResponse;
    import com.auth.auth.dtos.LoginRequest;
    import com.auth.auth.dtos.RegisterRequest;
import com.auth.auth.kafka.KafkaEventPublisher;
import com.auth.auth.model.Role;
    import com.auth.auth.model.User;
    import com.auth.auth.model.UserPrincipal;
    import com.auth.auth.service.JwtService;
    import com.auth.auth.service.UserService;
    import org.junit.jupiter.api.Test;
    import org.mockito.Mockito;
    import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;

    import org.springframework.boot.test.mock.mockito.MockBean;
    import org.springframework.context.annotation.Import;
    import org.springframework.http.MediaType;
    import org.springframework.security.authentication.AuthenticationManager;
    import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
    import org.springframework.security.core.Authentication;
    import org.springframework.test.context.ActiveProfiles;
    import org.springframework.test.web.servlet.MockMvc;
    import com.fasterxml.jackson.databind.ObjectMapper;

    import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
    import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;

    @WebMvcTest(UserController.class)
    
@Import(UserController.class)
@AutoConfigureMockMvc(addFilters = false) 
@ActiveProfiles("test")
    public class UserControllerTest {

        @Autowired
        private MockMvc mockMvc;

        @MockBean
        private JwtService jwtService;

        @MockBean
        private UserService userService;

        @MockBean
        private AuthenticationManager authenticationManager;

        @MockBean
        private KafkaEventPublisher kafkaEventPublisher;

        @MockBean
        private JwtFilter jwtFilter; // Not used in this test, but needed for @WebMvcTest

        @Autowired
        private ObjectMapper objectMapper; // to convert Java -> JSON

        @Test
        void testRegister() throws Exception {
            RegisterRequest request = new RegisterRequest();
            request.setUsername("testuser");
            request.setEmail("test@email.com");
            request.setPassword("password123");
            request.setRole(Role.USER);

            User user = new User();
            user.setUsername("testuser");
            user.setEmail("test@email.com");
            user.setPassword("encodedpass");
            user.setRole(Role.USER);

            Mockito.when(userService.saveUser(any(User.class))).thenReturn(user);

            mockMvc.perform(post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.message").value("User registered"));
        }

            @Test
            void testLoginSuccess() throws Exception {
                LoginRequest request = new LoginRequest();
                request.setUsername("testuser");
                request.setPassword("password");

                User user = new User();
                user.setUserId(UUID.randomUUID());
                user.setUsername("testuser");
                user.setEmail("test@email.com");
                user.setRole(Role.USER);

                UserPrincipal principal = new UserPrincipal(user);

                Authentication mockAuth = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());

                Mockito.when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                        .thenReturn(mockAuth);

                Mockito.when(jwtService.generateToken(principal)).thenReturn("mock-jwt-token");

                mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.message").value("Login Successful"))
                        .andExpect(jsonPath("$.token").value("mock-jwt-token"));
            }

            @Test
        void testLoginInvalidCredentials() throws Exception {
            LoginRequest request = new LoginRequest();
            request.setUsername("invaliduser");
            request.setPassword("wrongpass");

            Mockito.when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenThrow(new RuntimeException("Bad credentials"));

            mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.message").value("Invalid Credentials"))
                    .andExpect(jsonPath("$.token").doesNotExist());
        }
        @Test
        void testLoginFailsCompletely() throws Exception {
            LoginRequest request = new LoginRequest();
            request.setUsername("someuser");
            request.setPassword("somepass");

            // simulate no exception but still not authenticated
            Mockito.when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                    .thenReturn(null);

            mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isUnauthorized())
                    .andExpect(jsonPath("$.message").value("Invalid Credentials"));
        }
        @Test
        void testRegisterMissingFields() throws Exception {
            RegisterRequest request = new RegisterRequest(); // all fields null

            mockMvc.perform(post("/api/auth/register")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isBadRequest()); // Spring auto handles this with @Valid
        }

    }
