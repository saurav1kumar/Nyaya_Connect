import mongoose from 'mongoose';

const LawyerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  city: { type: String, required: true },
  experience: { type: String },
  consultationFee: { type: Number, default: 499 },
  rating: { type: Number, default: 4.5 },
  totalReviews: { type: Number, default: 0 },
  bio: { type: String },
  languages: [String],
  education: { type: String },
  isOnline: { type: Boolean, default: false },
  isVerified: { type: Boolean, default: true },
  password: { type: String, default: 'advocate123' },
}, { 
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      return ret;
    }
  },
  toObject: {
    transform: (doc, ret) => {
      ret.id = ret._id.toString();
      return ret;
    }
  }
});


export default mongoose.models.Lawyer || mongoose.model('Lawyer', LawyerSchema);
