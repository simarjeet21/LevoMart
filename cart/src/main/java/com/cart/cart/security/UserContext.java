package com.cart.cart.security;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;

@Data
@AllArgsConstructor
@NoArgsConstructor
@RequestScope
@Component
public class UserContext {
    private String userId;
    private String email;
    
    private String role;

    //public UserContext() {}
}