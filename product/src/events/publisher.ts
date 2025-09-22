import { producer } from "./kafka";

export const publishEvent = async (topic: string, payload: any) => {
  try {
    await producer.send({
      topic,
      messages: [
        {
          key: payload.id,
          value: JSON.stringify(payload),
        },
      ],
    });

    console.log(` Event sent to topic "${topic}"`);
  } catch (error) {
    console.error(` Failed to publish event to ${topic}:`, error);
  }
};
