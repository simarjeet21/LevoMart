package com.auth.auth.model;

import java.util.Collections;
import java.util.Collection;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;


// model class that implements UserDetails interface and make it own so that we can wrap our user and spring will know it 
// bassically wrapper for current user having additional things like authorities, account status etc.
public class UserPrincipal implements UserDetails {

    private static final long serialVersionUID = 1L;
    private final User user;
    public UserPrincipal(User user) {
        this.user = user;
    }

    @Override
    
    public Collection<? extends GrantedAuthority> getAuthorities() {
    return Collections.singleton(new SimpleGrantedAuthority("ROLE_"+user.getRole().name()));
}

    @Override
    public String getUsername() {
        return user.getUsername();
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public boolean isAccountNonExpired() {
       
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        
        return true;    }
        @Override
    public boolean isEnabled() {
        return true;
    }

    public User getUser() {
        return user;
    }

}
