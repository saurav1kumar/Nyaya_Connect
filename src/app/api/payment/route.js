import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Consultation from '@/models/Consultation';

export async function POST(request) {
  await dbConnect();
  try {
    const { sessionId, paymentMethod } = await request.json();

    const consultation = await Consultation.findOne({ id: sessionId });
    if (!consultation || consultation.status !== 'ASSIGNED') {
      return NextResponse.json({ error: 'Invalid consultation status' }, { status: 400 });
    }

    const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    consultation.status = 'PAID';
    consultation.paymentId = paymentId;
    consultation.paymentMethod = paymentMethod || 'SIMULATED';
    consultation.paidAt = new Date();
    await consultation.save();

    return NextResponse.json({ success: true, paymentId, consultation });
  } catch (error) {
    return NextResponse.json({ error: 'Payment failed' }, { status: 500 });
  }
}
