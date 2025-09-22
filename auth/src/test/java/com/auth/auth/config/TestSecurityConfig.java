// package com.auth.auth.config;

// import org.springframework.boot.test.context.TestConfiguration;
// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Primary;
// import org.springframework.context.annotation.Profile;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.config.http.SessionCreationPolicy;
// import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
// import org.springframework.security.crypto.password.PasswordEncoder;
// import org.springframework.security.web.SecurityFilterChain;

// @TestConfiguration
// @Profile("test")
// public class TestSecurityConfig {

//     @Bean
//     @Primary
//     public SecurityFilterChain testFilterChain(HttpSecurity http) throws Exception {
//         http
//             .csrf(csrf -> csrf.disable()) // Completely disable CSRF for tests
//             .authorizeHttpRequests(authz -> authz
//                 .requestMatchers("/register", "/login").permitAll()
//                 .requestMatchers("/admin/**").hasRole("ADMIN")
//                 .requestMatchers("/user/**").hasAnyRole("USER", "ADMIN")
//                 .anyRequest().authenticated()
//             )
//             .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

//         return http.build();
//     }

//     @Bean
//     public PasswordEncoder passwordEncoder() {
//         return new BCryptPasswordEncoder();
//     }
// }