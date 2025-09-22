package com.auth.auth.dtos;

import com.auth.auth.model.Role;
// import jakarta.validation.constraints.*;


import jakarta.persistence.Enumerated;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Username is required" )
    private String username;

    @Email(message = "Email is invalid")
    @NotBlank(message = "Email is required")
    private String email;

    @Size(min = 8, message = "Password must be at least 8 characters long")
     @NotBlank(message = "Password is required")
    private String password;

    @NotNull(message = "Role must be specified")
    @Enumerated(jakarta.persistence.EnumType.STRING)
    private Role role; // Assuming role is a string, you might want to change this to an enum or a specific type if needed
}
