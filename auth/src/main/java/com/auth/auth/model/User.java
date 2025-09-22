package com.auth.auth.model;

import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;


// model to store in database 
@Data
@Table(name = "users")
@Entity
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "userId", columnDefinition = "UUID", updatable = false, nullable = false)
    private UUID userId;

    @Column(name = "username", nullable = false, unique = true)
    private String username;
    
    private String password;
    
    private String email;

    @Enumerated(jakarta.persistence.EnumType.STRING)
    @Column( nullable = false)
    private Role role;

    @Version
    private Long version;

    public User(UUID userId, String username, String password, String email, Role role) {
    this.userId = userId;
    this.username = username;
    this.password = password;
    this.email = email;
    this.role = role;
    // this.version = 0L;
    // version will be managed by JPA
}

    


}
