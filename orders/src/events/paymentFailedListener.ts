import { validateWithSchema } from "../validators/validateEventSchema";
const schema = require(process.env.KAFKA_TOPIC_PAYMENT_FAILED_SCHEMA_PATH!); // same schema you used in product-service
import { consumer } from "./kafka";
import { prisma } from "../utils/prisma/prisma";
// Sequelize/Mongoose/etc model

export const listenPaymentFailed = async () => {
  await consumer.subscribe({ topic: "payment-failed", fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (!message.value) return;

      const payload = JSON.parse(message.value.toString());

      try {
        validateWithSchema(schema, payload); // ✅ schema validation

        const { orderId } = payload;

        const existingOrder = await prisma.order.findUnique({
          where: { id: orderId },
        });

        if (existingOrder) {
          await prisma.order.update({
            where: { id: orderId },
            data: {
              status: "CANCELLED",
              updatedAt: new Date(),
            },
          });

          console.log(`✅ Order ${orderId} marked as CANCELLED`);
        }
      } catch (err) {
        console.error("❌ Failed to process payment-failed event:", err);
      }
    },
  });
};
