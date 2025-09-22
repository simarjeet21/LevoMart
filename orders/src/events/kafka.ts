import { Kafka } from "kafkajs";

export const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: [process.env.KAFKA_BROKERS_ADDRESS!], // replace with actual Kafka broker address if needed
});

export const producer = kafka.producer();
export const consumer = kafka.consumer({ groupId: "order-service-group" });
// const producer = kafka.producer({
//   acks: 1, // wait for at least one broker to acknowledge the message
//   retries: 3, // retrys sending the message up to 3 times
// });

export const initKafka = async () => {
  await producer.connect();
  console.log("Kafka Producer Connected");
};
