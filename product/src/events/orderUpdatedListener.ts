import { consumer } from "./kafka";
import { validateWithSchema } from "../validators/validateEventSchema";
import { Product } from "../models/product";
const schema = require(process.env.KAFKA_TOPIC_ORDER_UPDATED_SCHEMA_PATH!);

export const listenOrderUpdated = async () => {
  await consumer.subscribe({ topic: "order-updated", fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const payload = JSON.parse(message.value.toString());

      try {
        validateWithSchema(schema, payload);

        if (payload.status === "CANCELLED") {
          for (const item of payload.orderItems) {
            await Product.updateOne(
              { _id: item.productId },
              { $inc: { stock: item.quantity } }
            );
          }

          console.log(
            "♻️ Restored stock in Product Service due to cancellation"
          );
        }

        // No action needed on COMPLETED or PENDING
      } catch (err) {
        console.error("❌ Failed to process stock adjustment:", err);
      }
    },
  });
};
