package com.cart.cart.dtos;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AddToCartRequest {

    @NotBlank
    private String productId;

    @Min(1)
    private int quantity;

    @NotBlank
    private String productName;

    @NotNull
    @Min(0)
    private Float productPrice;

    @NotBlank
    private String sellerId;
}
