import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  sessionId: { type: String, required: true }, // Links to Consultation.id
  sender: { type: String, enum: ['client', 'advocate', 'system'], required: true },
  senderName: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export default mongoose.models.Message || mongoose.model('Message', MessageSchema);
