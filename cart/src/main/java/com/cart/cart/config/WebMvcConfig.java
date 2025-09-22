// package com.cart.cart.config;

// //import com.cart.cart.security.CurrentUserInterceptor;
// import lombok.RequiredArgsConstructor;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.web.servlet.HandlerInterceptor;
// import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
// import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// @Configuration
// @RequiredArgsConstructor
// public class WebMvcConfig implements WebMvcConfigurer {

//     // private final CurrentUserInterceptor currentUserInterceptor;

//     // @Override
//     // public void addInterceptors(InterceptorRegistry registry) {
//     //     registry.addInterceptor(currentUserInterceptor)
//     //             .addPathPatterns("/api/**"); // adjust your base path
//     // }
//     private final HandlerInterceptor currentUserInterceptor;

//     @Override
//     public void addInterceptors(InterceptorRegistry registry) {
//         registry.addInterceptor(currentUserInterceptor).addPathPatterns("/api/**");
//     }
// }