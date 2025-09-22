// package com.payment.payment.security;



// import io.jsonwebtoken.Claims;
// import jakarta.servlet.http.HttpServletRequest;
// import jakarta.servlet.http.HttpServletResponse;
// import lombok.RequiredArgsConstructor;

// //import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.stereotype.Component;
// import org.springframework.web.context.request.RequestContextHolder;
// import org.springframework.web.servlet.HandlerInterceptor;
// import org.springframework.web.context.request.RequestAttributes;
// import org.springframework.web.context.request.ServletRequestAttributes; // ✅ Needed


// @Component
// @RequiredArgsConstructor
// public class CurrentUserInterceptor implements HandlerInterceptor {
//     //@Autowired
//     private final JwtUtils jwtUtils;
//     //private final UserContext userContext;

//    @Override
// public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
//     String authHeader = request.getHeader("Authorization");

//     if (authHeader != null && authHeader.startsWith("Bearer ")) {
//         try {
//             String token = authHeader.substring(7);
//             Claims claims = jwtUtils.parseToken(token);

//             // Safely get request-scoped attributes
//             ServletRequestAttributes attributes =
//                     (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();

//             if (attributes == null) {
//                 response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
//                 return false;
//             }

//             UserContext userContext = new UserContext();
//             userContext.setUserId(claims.get("id", String.class));
//             userContext.setEmail(claims.get("email", String.class));
//             userContext.setRole(claims.get("role", String.class));

//             // Save to request scope
//             attributes.setAttribute("userContext", userContext, RequestAttributes.SCOPE_REQUEST);

//         } catch (Exception e) {
//             response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//             return false;
//         }
//     } else {
//         response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
//         return false;
//     }
//     //System.out.println("Current user: " + claims.get("id") + ", role: " + claims.get("role"));


//     return true;
// }

// }
