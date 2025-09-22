import { validateWithSchema } from "../validators/validateEventSchema";
const schema = require(process.env.KAFKA_TOPIC_PRODUCT_UPDATED_SCHEMA_PATH!);
import { publishEvent } from "./publisher";
import { ProductDoc } from "../models/product";

export const productUpdated = async (product: ProductDoc) => {
  const eventPayload = {
    id: product.id,
    name: product.name,
    price: product.price,
    userId: product.userId,
    description: product.description,
    category: product.category,
    orderId: product.orderId || null,
    stock: product.stock,
    imageUrl: product.imageUrl || null,
    createdAt: new Date(product.createdAt).toISOString(), // ✅ fix here
    updatedAt: new Date(product.updatedAt).toISOString(), // ✅ and here
  };

  validateWithSchema(schema, eventPayload); // ✅ Validate before sending
  await publishEvent("product-updated", eventPayload);
};
