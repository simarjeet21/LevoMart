package com.auth.auth.integration;

import com.auth.auth.dtos.RegisterRequest;
import com.auth.auth.model.Role;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
// import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testRegisterEndpoint_success() throws Exception {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("mockuser");
        request.setPassword("password");
        request.setEmail("mockuser@example.com");
        request.setRole(Role.USER);

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("User registered"))
                .andExpect(jsonPath("$.token").doesNotExist());
    }

    @Test
    void testRegisterEndpoint_missingFields() throws Exception {
        //RegisterRequest request = new RegisterRequest(); // empty fields

        mockMvc.perform(post("/api/auth/register")
        .contentType(MediaType.APPLICATION_JSON)
        .content(objectMapper.writeValueAsString(new RegisterRequest())))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.username").value("Username is required"))
        .andExpect(jsonPath("$.email").value("Email is required"))
        .andExpect(jsonPath("$.role").value("Role must be specified"));

    }
}
