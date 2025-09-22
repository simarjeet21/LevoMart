package com.cart.cart.utils;

import com.cart.cart.dtos.CartItemResponseDto;
import com.cart.cart.dtos.CartResponseDto;
import com.cart.cart.model.Cart;
import com.cart.cart.model.CartItem;

import java.util.List;
import java.util.stream.Collectors;

public class CartMapper {

    public static CartResponseDto toDto(Cart cart) {
        List<CartItemResponseDto> itemDtos = cart.getItems().stream().map(CartMapper::mapItem).collect(Collectors.toList());
        int totalItems = cart.getItems().stream().mapToInt(CartItem::getQuantity).sum();
        float cartTotal = cart.getItems().stream().map(item -> item.getTotalPrice()).reduce(0f, Float::sum);

        return CartResponseDto.builder()
                .userId(cart.getUserId())
                .items(itemDtos)
                .totalItems(totalItems)
                .cartTotal(cartTotal)
                .build();
    }

    private static CartItemResponseDto mapItem(CartItem item) {
        return CartItemResponseDto.builder()
                .productId(item.getProductId())
                .productName(item.getProductName())
                .sellerId(item.getSellerId())
                .price(item.getProductPrice())
                .quantity(item.getQuantity())
                .totalPrice(item.getTotalPrice())
                .build();
    }
}
