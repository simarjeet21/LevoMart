package com.auth.auth.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.auth.auth.dao.UserRepo;
import com.auth.auth.model.User;
import com.auth.auth.model.UserPrincipal;

// Service use to get user from username and return user wrapped in UserPrincipal   
@Service
public class MyUserDetailesService implements UserDetailsService{
    
    @Autowired
    UserRepo userRepo;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        
        User user = userRepo.findByUsername(username);

        if(user==null){
            System.err.println("User 404");
            throw new UsernameNotFoundException("User not found with username: " + username);
        }
        //wrapping the user in UserPrincipal
        return new UserPrincipal(user);
        
    }

}
