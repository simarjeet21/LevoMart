package com.cart.cart.controller;

// public class CartController {

// }
// package com.car.controller;


import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.cart.cart.dtos.AddToCartRequest;
import com.cart.cart.dtos.CartResponseDto;
import com.cart.cart.security.UserContext;
// import com.cart.cart.dtos.PlaceOrderRequestDto;
// import com.cart.cart.model.Cart;
import com.cart.cart.security.UserContextHolder;
import com.cart.cart.service.CartService;

@RestController
@RequestMapping("/api/cart/user")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    //private UserContextHolder userContextHolder;
    private final UserContext userContext;
    

    

    @PostMapping("/add")
    public ResponseEntity<Void> addToCart(@RequestBody AddToCartRequest request) {
        //String userId = userContextHolder.getCurrentUser().getUserId();
        String userId = userContext.getUserId();
        cartService.addToCart(userId, request);
        return ResponseEntity.ok().build();
    }
    @PutMapping("/update-quantity")
    public ResponseEntity<Void> updateQuantity(@RequestBody AddToCartRequest request) {
        //String userId = userContextHolder.getCurrentUser().getUserId();
         String userId = userContext.getUserId();
        cartService.updateQuantity(userId, request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Void> removeFromCart(@PathVariable String productId) {
        //String userId = userContextHolder.getCurrentUser().getUserId();
         String userId = userContext.getUserId();
        cartService.removeFromCart(userId, productId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/getCart")
    public ResponseEntity<CartResponseDto> getCart() {
        // String userId = userContextHolder.getCurrentUser().getUserId(); 
          String userId = userContext.getUserId();
        return ResponseEntity.ok(cartService.getCart(userId));
    }
    @GetMapping("/ping")
    public ResponseEntity<String> healthCheck() {
        System.out.println("✅ Cart service is alive");
        return ResponseEntity.ok("Cart service is alive!");
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearCart() {
        //String userId = userContextHolder.getCurrentUser().getUserId();
         String userId = userContext.getUserId();
        cartService.clearCart(userId);
        return ResponseEntity.ok().build();
    }
    

     
}
