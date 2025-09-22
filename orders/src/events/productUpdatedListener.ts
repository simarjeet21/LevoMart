import { validateWithSchema } from "../validators/validateEventSchema";

const schema = require(process.env.KAFKA_TOPIC_PRODUCT_UPDATED_SCHEMA_PATH!);
import { consumer } from "./kafka";
import { prisma } from "../utils/prisma/prisma";

export const listenProductUpdated = async () => {
  await consumer.subscribe({ topic: "product-updated", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (!message.value) return;

      const payload = JSON.parse(message.value.toString());

      try {
        validateWithSchema(schema, payload);

        const existingProduct = await prisma.product.findUnique({
          where: { id: payload.id },
        });

        if (!existingProduct) {
          console.warn(`Product with ID ${payload.id} not found for update.`);
          return;
        }

        await prisma.product.update({
          where: { id: payload.id },
          data: {
            name: payload.name,
            price: payload.price,
            userId: payload.userId,
            updatedAt: new Date(payload.updatedAt),
          },
        });

        console.log("✅ Product updated in order service");
      } catch (err) {
        console.error("❌ Failed to process product-updated event:", err);
      }
    },
  });
};
