package com.cart.cart;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
  "spring.kafka.consumer.auto-startup=false"
})
class CartApplicationTests {

	@Test
	void contextLoads() {
	}

}
