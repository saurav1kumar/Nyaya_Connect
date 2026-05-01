import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Consultation from '@/models/Consultation';
import Lawyer from '@/models/Lawyer';
import Settings from '@/models/Settings';

export async function GET(request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const phone = searchParams.get('phone');
    const id = searchParams.get('id'); // This is the CS-XXX id
    const lawyerId = searchParams.get('lawyerId');

    if (phone) {
      const results = await Consultation.find({ clientPhone: new RegExp(phone, 'i') });
      return NextResponse.json(results);
    }

    if (id) {
      const found = await Consultation.findOne({ id });
      if (!found) return NextResponse.json({ error: 'Not found' }, { status: 404 });
      return NextResponse.json(found);
    }

    if (lawyerId) {
      const results = await Consultation.find({ lawyerId });
      return NextResponse.json(results);
    }

    const all = await Consultation.find({}).sort({ createdAt: -1 });
    return NextResponse.json(all);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch consultations' }, { status: 500 });
  }
}

export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const count = await Consultation.countDocuments();
    
    let settings = await Settings.findOne({ key: 'platform_settings' });
    if (!settings) settings = await Settings.create({ key: 'platform_settings' });

    const newConsultation = await Consultation.create({
      ...body,
      id: `CS-${String(count + 1).padStart(3, '0')}`,
      fee: settings.defaultConsultationFee,
      status: 'PENDING',
    });

    return NextResponse.json(newConsultation, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create consultation' }, { status: 500 });
  }
}

export async function PATCH(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const { id, action, lawyerId, paymentId } = body;

    const consultation = await Consultation.findOne({ id });
    if (!consultation) return NextResponse.json({ error: 'Consultation not found' }, { status: 404 });

    switch (action) {
      case 'ASSIGN': {
        const lawyer = await Lawyer.findById(lawyerId);
        if (!lawyer) return NextResponse.json({ error: 'Lawyer not found' }, { status: 404 });
        consultation.lawyerId = lawyer._id;
        consultation.lawyerName = lawyer.name;
        consultation.fee = lawyer.consultationFee || consultation.fee;
        consultation.status = 'ASSIGNED';
        consultation.assignedAt = new Date();
        break;
      }
      case 'MARK_CALL_DONE': {
        consultation.callDone = true;
        consultation.callDoneAt = new Date();
        break;
      }
      case 'PAY': {
        consultation.paymentId = paymentId || `PAY-${Date.now()}`;
        consultation.status = 'PAID';
        consultation.paidAt = new Date();
        break;
      }
      case 'ACCEPT': {
        consultation.status = 'ACTIVE';
        consultation.startedAt = new Date();
        break;
      }
      case 'COMPLETE': {
        consultation.status = 'COMPLETED';
        consultation.endedAt = new Date();
        break;
      }
      case 'CANCEL': {
        consultation.status = 'CANCELLED';
        consultation.endedAt = new Date();
        break;
      }
    }

    await consultation.save();
    return NextResponse.json(consultation);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update consultation' }, { status: 500 });
  }
}
