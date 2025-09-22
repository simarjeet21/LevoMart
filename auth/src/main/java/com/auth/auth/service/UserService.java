package com.auth.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.auth.auth.dao.UserRepo;
import com.auth.auth.kafka.events.UserCreatedEventDto;
import com.auth.auth.kafka.validator.JsonSchemaValidator;
import com.auth.auth.model.User;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

// service used to save user details in the database for custome controller methods 
// @Service
// @RequiredArgsConstructor
// public class UserService {
    
//     private final UserRepo repo;
//     private final PasswordEncoder encoder;
//     private final KafkaTemplate<String, String> kafkaTemplate;
//     private final ObjectMapper objectMapper = new ObjectMapper();
//     @Value("${schema.user.created.path}")
//     private final String schemaPath;

//     @Value("${topic.user-created}")
//     private String userCreatedTopic;


//     public User saveUser(User user) {
//         String encodedPassword = encoder.encode(user.getPassword());
//         user.setPassword(encodedPassword);
//         User savedUser= repo.save(user);
//         try {
//             UserCreatedEventDto event = new UserCreatedEventDto(savedUser.getUserId(), savedUser.getEmail(),savedUser.getRole());

//             String json = objectMapper.writeValueAsString(event);
//             //String schemaPath="../../shared-schemas/auth/user-created.schema.json"; 
//             JsonSchemaValidator.validate(json, schemaPath);

//             kafkaTemplate.send(userCreatedTopic, json);
//             System.out.println("✅ Published user-created event: " + json);
//         } catch (Exception e) {
           
//             System.err.println("❌ Failed to publish user-created event: " + e.getMessage());
//         }
//         return savedUser;
//     }



// }
@Service
public class UserService {

    private final UserRepo repo;
    private final PasswordEncoder encoder;
    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final String schemaPath;
    private final String userCreatedTopic;

    public UserService(
        UserRepo repo,
        PasswordEncoder encoder,
          @Autowired(required = false)  KafkaTemplate<String, String> kafkaTemplate,
        @Value("${schema.user.created.path}") String schemaPath,
        @Value("${topic.user-created}") String userCreatedTopic
    ) {
        this.repo = repo;
        this.encoder = encoder;
        this.kafkaTemplate = kafkaTemplate;
        this.schemaPath = schemaPath;
        this.userCreatedTopic = userCreatedTopic;
    }

    public User saveUser(User user) {
        String encodedPassword = encoder.encode(user.getPassword());
        user.setPassword(encodedPassword);
        User savedUser = repo.save(user);

        try {
            UserCreatedEventDto event = new UserCreatedEventDto(
                savedUser.getUserId(),
                savedUser.getEmail(),
                savedUser.getRole()
            );

            String json = objectMapper.writeValueAsString(event);
            JsonSchemaValidator.validate(json, schemaPath);
            if (kafkaTemplate != null) {
    kafkaTemplate.send(userCreatedTopic, json);
    System.out.println("✅ Published user-created event: " + json);
} else {
    System.out.println("⚠️ Kafka is disabled. Skipping event publishing.");
}


            System.out.println("✅ Published user-created event: " + json);
        } catch (Exception e) {
            System.err.println("❌ Failed to publish user-created event: " + e.getMessage());
        }

        return savedUser;
    }
}

