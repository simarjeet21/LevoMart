package com.auth.auth.kafka.events;

import java.util.UUID;

import com.auth.auth.model.Role;

import jakarta.persistence.Enumerated;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserCreatedEventDto {
    private UUID userId;
    private String email;
    //private String role;
    
    @Enumerated(jakarta.persistence.EnumType.STRING)
    private Role role; 
    
}
