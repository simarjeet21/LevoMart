package com.auth.auth.integration;

import com.auth.auth.model.Role;
import com.auth.auth.model.User;
import com.auth.auth.service.UserService;
import com.auth.auth.dao.UserRepo;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")  // tells Spring to use application-test.yml
public class UserServiceIntegrationTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepo userRepo;

    @Test
    void testSaveUserAndFetchFromH2() {
        User user = new User();
        user.setUsername("integrationUser");
        user.setPassword("mysecurepass");
        user.setEmail("int@example.com");
        user.setRole(Role.USER);

        User savedUser = userService.saveUser(user);

        assertNotNull(savedUser);
        //assertTrue(savedUser.getUserId() > 0);

        User fromDb = userRepo.findByUsername("integrationUser");
        assertNotNull(fromDb);
        assertEquals("int@example.com", fromDb.getEmail());
    }
}
