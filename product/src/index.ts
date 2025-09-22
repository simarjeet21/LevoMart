import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { app } from "./app";
import { consumer, initKafka, producer } from "./events/kafka";
import { listenOrderCreated } from "./events/orderCreatedListener";
import { listenOrderUpdated } from "./events/orderUpdatedListener";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDb");
  } catch (err) {
    console.error(err);
  }
  try {
    await initKafka();
    consumer.connect();
    console.log("✅ Kafka Consumer Connected");

    // ✅ Start all listeners
    await Promise.all([listenOrderCreated(), listenOrderUpdated()]);
  } catch (error) {
    console.log(error);
  }

  app.listen(process.env.PORT || 4000, () => {
    console.log(`Listening on port ${process.env.PORT}`);
  });
};

start();
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
