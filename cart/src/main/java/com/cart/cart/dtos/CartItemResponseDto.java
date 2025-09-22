package com.cart.cart.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class CartItemResponseDto {
    private String productId;
    private String productName;
    private String sellerId;
    private float price;
    private int quantity;
    private float totalPrice;
}
