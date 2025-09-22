import dotenv from "dotenv";
import { app } from "./app";
import { initKafka, consumer, producer } from "./events/kafka";
import { listenProductCreated } from "./events/productCreatedListener";
import { listenProductUpdated } from "./events/productUpdatedListener";

dotenv.config();

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  try {
    await initKafka(); // ✅ Only producer.connect()
    await consumer.connect(); // ✅ Separate consumer.connect()
    console.log("✅ Kafka Consumer Connected");
    //✅ Start all listeners
    await Promise.all([listenProductCreated(), listenProductUpdated()]);
  } catch (err) {
    console.error("❌ Error starting Kafka/listeners:", err);
    process.exit(1);
  }

  const port = process.env.PORT || 4000;
  app.listen(port, () => {
    console.log(`🚀 Order service listening on port ${port}`);
  });
};

start();
//Graceful shutdown handling
process.on("SIGINT", async () => {
  console.log("🛑 Caught SIGINT. Shutting down gracefully...");
  await producer.disconnect();
  await consumer.disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("🛑 Caught SIGTERM. Shutting down gracefully...");
  await producer.disconnect();
  await consumer.disconnect();
  process.exit(0);
});
