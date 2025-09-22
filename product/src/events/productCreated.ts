import { validateWithSchema } from "../validators/validateEventSchema";

// Check if the environment variable is defined
if (!process.env.KAFKA_TOPIC_PRODUCT_CREATED_SCHEMA_PATH) {
  throw new Error(
    "KAFKA_TOPIC_PRODUCT_CREATED_SCHEMA_PATH environment variable is not defined"
  );
}

const schema = require(process.env.KAFKA_TOPIC_PRODUCT_CREATED_SCHEMA_PATH);

if (!schema) {
  throw new Error("Failed to load schema from the specified path");
}

import { publishEvent } from "./publisher";
import { ProductDoc } from "../models/product";

export const productCreated = async (product: ProductDoc) => {
  const eventPayload = {
    id: product?.id.toString(),
    name: product.name,
    price: product.price,
    userId: product.userId,
    description: product.description,
    category: product.category,
    orderId: product.orderId || null,
    stock: product.stock,
    imageUrl: product.imageUrl || null,
    createdAt: new Date(product.createdAt).toISOString(),
    updatedAt: new Date(product.updatedAt).toISOString(),
  };

  validateWithSchema(schema, eventPayload);
  await publishEvent("product-created", eventPayload);
};
