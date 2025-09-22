import { Product } from "../models/product";
import { validateWithSchema } from "../validators/validateEventSchema";
const schema = require(process.env.KAFKA_TOPIC_ORDER_CREATED_SCHEMA_PATH!); // same schema you used in product-service
import { consumer } from "./kafka";

// Sequelize/Mongoose/etc model

export const listenOrderCreated = async () => {
  await consumer.subscribe({ topic: "order-created", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const payload = JSON.parse(message.value.toString());
      try {
        validateWithSchema(schema, payload);

        for (const item of payload.orderItems) {
          await Product.updateOne(
            { _id: item.productId, stock: { $gte: item.quantity } },
            { $inc: { stock: -item.quantity } }
          );
        }

        console.log("✅ Reserved stock in Product Service");
      } catch (err) {
        console.error("❌ Failed to reserve stock:", err);
      }
    },
  });
};
