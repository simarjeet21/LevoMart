import { validateWithSchema } from "../validators/validateEventSchema";
const schema = require(process.env.KAFKA_TOPIC_PRODUCT_CREATED_SCHEMA_PATH!); // same schema you used in product-service
import { consumer } from "./kafka";
import { prisma } from "../utils/prisma/prisma";
// Sequelize/Mongoose/etc model

export const listenProductCreated = async () => {
  await consumer.subscribe({ topic: "product-created", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (!message.value) return;

      const payload = JSON.parse(message.value.toString());

      try {
        validateWithSchema(schema, payload); // ✅ schema validation

        const existingProduct = await prisma.product.findUnique({
          where: { id: payload.id },
        });

        if (!existingProduct) {
          await prisma.product.create({
            data: {
              id: payload.id,
              name: payload.name,
              price: payload.price,
              userId: payload.userId, // assuming userId is the seller
              createdAt: new Date(payload.createdAt),
              updatedAt: new Date(payload.updatedAt),
            },
          });
          console.log("✅ Product created in order service");
        }
      } catch (err) {
        console.error("❌ Failed to process product-created event:", err);
      }
    },
  });
};
