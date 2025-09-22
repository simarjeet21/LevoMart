package com.auth.auth.config;


import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.auth.auth.service.JwtService;
import com.auth.auth.service.MyUserDetailesService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;



// JwtFilter intercepts.

// Extracts token and gets username "john".

// Loads user "john" from DB.

// Validates token for "john".

// Authenticates the request.

// Request goes to /api/products controller with a valid user.

//filter to add in filter chain like middleware 
@Component
public class JwtFilter extends OncePerRequestFilter{

    @Autowired
    JwtService jwtService;

    @Autowired
    ApplicationContext context;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException,IOException{

        String authHeader = request.getHeader("Authorization");
        String token =null;
        String userName = null;
        if(authHeader != null && authHeader.startsWith("Bearer ")){
            token = authHeader.substring(7);
            userName= jwtService.extractUserName(token);
        }
        if(userName != null && SecurityContextHolder.getContext().getAuthentication() == null){
            //object like we wrapped user in userprincipal which implements userdetailes current object
            UserDetails userDetails = context.getBean(MyUserDetailesService.class).loadUserByUsername(userName);

            if(jwtService.validateToken(token, userDetails)){
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
            
    }
    filterChain.doFilter(request, response);

}
}
