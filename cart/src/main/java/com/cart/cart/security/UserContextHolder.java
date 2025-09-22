package com.cart.cart.security;

import org.springframework.stereotype.Component;
import org.springframework.web.context.annotation.RequestScope;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

@Component
@RequestScope
public class UserContextHolder {

    public UserContext getCurrentUser() {
    ServletRequestAttributes attributes = 
        (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

    if (attributes == null) {
        System.out.println("⚠️ RequestAttributes is null. Are you calling outside an HTTP request?");
        return null;
    }

    UserContext userContext = (UserContext) attributes.getAttribute("userContext", ServletRequestAttributes.SCOPE_REQUEST);
    if (userContext == null) {
        System.out.println("⚠️ UserContext not found in request attributes.");
    }
    return userContext;
}

}
