package com.cart.cart.dtos;



import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class CartResponseDto {
    private String userId;
    private List<CartItemResponseDto> items;
    private int totalItems;
    private float cartTotal;
}
