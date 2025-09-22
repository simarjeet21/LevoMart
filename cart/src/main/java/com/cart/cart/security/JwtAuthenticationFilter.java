package com.cart.cart.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtils jwtUtils;
    @Autowired
    private UserContext userContext;

    // public JwtAuthenticationFilter(JwtUtils jwtUtils) {
    //     this.jwtUtils = jwtUtils;
    // }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            try {
                String token = header.substring(7);
                Claims claims = jwtUtils.parseToken(token);

                String email = claims.get("email", String.class);
                String role = claims.get("role", String.class);
                String userId = claims.get("id", String.class);

                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                email,
                                null,
                                List.of(new SimpleGrantedAuthority("ROLE_" + role))
                        );

                SecurityContextHolder.getContext().setAuthentication(authentication);
                // ✅ 2. Set to UserContext (request scoped)
                // ServletRequestAttributes attributes =
                //         (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

                // if (attributes != null) {
                //     // UserContext userContext = new UserContext(userId, email, role);
                //     userContext.setUserId(userId);
                //     userContext.setEmail(email);
                //     userContext.setRole(role);
                //     attributes.setAttribute("userContext", userContext, RequestAttributes.SCOPE_REQUEST);
                // }
                userContext.setUserId(userId);
                userContext.setEmail(email);
                userContext.setRole(role);


            } catch (Exception e) {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        }

        filterChain.doFilter(request, response);
    }
}
