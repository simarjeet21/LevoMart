package com.cart.cart.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class CartItem {
    // @Id
    // @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    //private String cartItemId;
    private String productId;
    private String productName;
    private Float productPrice;
    private String sellerId;
    private Float totalPrice;
    private int quantity;
    


}
