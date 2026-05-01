import mongoose from 'mongoose';

const ConsultationSchema = new mongoose.Schema({
  id: { type: String, unique: true }, // Legacy ID like CS-001
  clientName: { type: String, required: true },
  clientPhone: { type: String, required: true },
  category: { type: String, required: true },
  state: { type: String },
  city: { type: String, required: true },

  issue: { type: String, required: true },
  lawyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Lawyer' },
  lawyerName: { type: String },
  fee: { type: Number },
  status: { 
    type: String, 
    enum: ['PENDING', 'ASSIGNED', 'PAID', 'ACTIVE', 'COMPLETED', 'CANCELLED'],
    default: 'PENDING'
  },
  paymentId: { type: String },
  paymentMethod: { type: String },
  callDone: { type: Boolean, default: false },
  assignedAt: { type: Date },
  callDoneAt: { type: Date },
  paidAt: { type: Date },
  startedAt: { type: Date },
  endedAt: { type: Date },
}, { 
  timestamps: true,
  toJSON: {
    transform: (doc, ret) => {
      // ret.id is already a custom field in this model, so we keep it
      return ret;
    }
  }
});


export default mongoose.models.Consultation || mongoose.model('Consultation', ConsultationSchema);
