import express from "express";
import { Notification } from "../models/Notification";
import { transporter } from "../services/mailer";

const router = express.Router();

router.post("/", async (req, res) => {
  const { userId, type, to, subject, message } = req.body;

  const notification = new Notification({
    userId,
    type,
    to,
    subject,
    message,
  });

  try {
    if (type === "EMAIL") {
      await transporter.sendMail({
        from: `"Notifier" <${process.env.SMTP_USER}>`,
        to,
        subject,
        text: message,
      });

      notification.status = "SENT";
    }

    await notification.save();
    res.status(200).json({ message: "Notification sent/stored", notification });
  } catch (error: any) {
    notification.status = "FAILED";
    notification.error = error.message;
    await notification.save();
    res
      .status(500)
      .json({ message: "Notification failed", error: error.message });
  }
});

export default router;
