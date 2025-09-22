package com.auth.auth.config;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
// import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import jakarta.servlet.http.HttpServletResponse;

//manual and custom security configuration for the applications
@Configuration
@EnableWebSecurity
//@Profile("!test") // Exclude this configuration in the test profile
@EnableMethodSecurity
public class SecurityConfig {

	@Autowired
	// it is the object of myuserdetailesService which implements UserDetailsService
	private UserDetailsService userDetailsService;

	@Autowired
	private JwtFilter jwtFilter;
	
	@Bean
	public AuthenticationProvider authProvider() {
		DaoAuthenticationProvider provider = new DaoAuthenticationProvider(userDetailsService);
    // provider.setUserDetailsService(userDetailsService);
    provider.setPasswordEncoder(passwordEncoder());
    return provider;
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder(12);
	}
	

	@Bean
	public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

		http.csrf(customizer -> customizer.disable())
				.authorizeHttpRequests(request -> request
						.requestMatchers("/v3/api-docs/**",
                "/swagger-ui/**",
                "/swagger-ui.html","/api/auth/register", "/api/auth/login")
						.permitAll()
						
                
            
						.anyRequest().authenticated())
				.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
				.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
				.exceptionHandling(exception -> exception
				.authenticationEntryPoint((request, response, authException) -> {
						response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
						response.setContentType("application/json");
						response.getWriter().write("{\"message\": \"Unauthorized\"}");})
						
						.accessDeniedHandler((request, response, accessDeniedException) -> {
      response.setStatus(HttpStatus.FORBIDDEN.value());
      response.setContentType("application/json");
      response.getWriter().write("{\"message\":\"Access Denied\"}");
  }))
						;


		return http.build();
	}

	@Bean
	//for custome methods like login and register
	public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}
	
	
// 	@Configuration
// @Profile("test")
// public class TestSecurityConfig {
//     @Bean
//     public SecurityFilterChain testSecurityFilterChain(HttpSecurity http) throws Exception {
//         http.csrf(csrf -> csrf.disable());
//         return http.build();
//     }
//}
	
	/*
	 * @Bean public UserDetailsService userDetailsService() {
	 * 
	 * UserDetails user=User .withDefaultPasswordEncoder() .username("navin")
	 * .password("n@123") .roles("USER") .build();
	 * 
	 * UserDetails admin=User .withDefaultPasswordEncoder() .username("admin")
	 * .password("admin@789") .roles("ADMIN") .build();
	 * 
	 * return new InMemoryUserDetailsManager(user,admin); }
	 */
	
	
}
