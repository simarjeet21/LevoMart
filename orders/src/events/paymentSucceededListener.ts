import { consumer } from "./kafka";
import { prisma } from "../utils/prisma/prisma";
const schema = require(process.env.KAFKA_TOPIC_PAYMENT_SUCCEEDED_SCHEMA_PATH!);
import { validateWithSchema } from "../validators/validateEventSchema";

export const listenPaymentSucceeded = async () => {
  await consumer.subscribe({
    topic: "payment-succeeded",
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (!message.value) return;

      const payload = JSON.parse(message.value.toString());

      try {
        // ✅ Validate against schema
        validateWithSchema(schema, payload);

        const { orderId } = payload;

        // ✅ Update order status to COMPLETED
        await prisma.order.update({
          where: { id: orderId },
          data: {
            status: "COMPLETED",
            updatedAt: new Date(),
          },
        });

        console.log(`✅ Order ${orderId} marked as COMPLETED`);
      } catch (err) {
        console.error("❌ Failed to process payment-succeeded event:", err);
      }
    },
  });
};
