package com.auth.auth.integration;

import com.auth.auth.dao.UserRepo;
import com.auth.auth.model.Role;
import com.auth.auth.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

import java.util.UUID;

@DataJpaTest
@ActiveProfiles("test")
public class UserRepoIntegrationTest {

    @Autowired
    private UserRepo userRepo;

    @Test
    void testUsernameMustBeUnique() {
        //User u1 = new User(UUID.randomUUID(), "sameuser", "pass1", "u1@example.com", Role.USER);
        User u1 = new User();
        
        u1.setUsername("sameuser");
        u1.setPassword("pass1");
        u1.setEmail("ui@example.com");
        u1.setRole(Role.USER);
      //  User u2 = new User(UUID.randomUUID(),"sameuser", "pass2", "u2@example.com", Role.USER);
        User u2 = new User();
     
        u2.setUsername("sameuser");
        u2.setPassword("pass2");
        u2.setEmail("u2@example.com");
        u2.setRole(Role.USER);

        userRepo.save(u1);
        assertThrows(DataIntegrityViolationException.class, () -> userRepo.saveAndFlush(u2));
    }
}
