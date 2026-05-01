import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Message from '@/models/Message';
import Consultation from '@/models/Consultation';

export async function GET(request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');
    const after = searchParams.get('after');

    if (!sessionId) return NextResponse.json({ error: 'sessionId required' }, { status: 400 });

    let query = { sessionId };
    if (after) query._id = { $gt: after };

    const messages = await Message.find(query).sort({ timestamp: 1 });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const { sessionId, sender, senderName, text } = body;

    const consultation = await Consultation.findOne({ id: sessionId });
    if (!consultation || consultation.status !== 'ACTIVE') {
      return NextResponse.json({ error: 'Session not active' }, { status: 403 });
    }

    const newMessage = await Message.create({
      sessionId,
      sender,
      senderName,
      text: text.trim(),
      timestamp: new Date()
    });

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
