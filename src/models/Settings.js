import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema({
  key: { type: String, default: 'platform_settings' },
  defaultConsultationFee: { type: Number, default: 499 },
  platformCommission: { type: Number, default: 20 },
  currency: { type: String, default: 'INR' },
  freeCallDurationMinutes: { type: Number, default: 15 },
});

export default mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
