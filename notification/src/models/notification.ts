// models/Notification.ts

import { Schema, model } from "mongoose";

const NotificationSchema = new Schema({
  userId: { type: String, required: true },
  type: { type: String, enum: ["EMAIL", "SMS", "PUSH"], required: true },
  to: { type: String, required: true }, // email or phone
  subject: String, // for email
  message: String,
  data: Schema.Types.Mixed, // any custom payload
  status: {
    type: String,
    enum: ["PENDING", "SENT", "FAILED"],
    default: "PENDING",
  },
  error: String,
  createdAt: { type: Date, default: Date.now },
});

export const Notification = model("Notification", NotificationSchema);
