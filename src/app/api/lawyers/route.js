import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Lawyer from '@/models/Lawyer';

export async function GET() {
  await dbConnect();
  try {
    const lawyers = await Lawyer.find({}).select('-password');
    return NextResponse.json(lawyers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch lawyers' }, { status: 500 });
  }
}

export async function POST(request) {
  await dbConnect();
  try {
    const body = await request.json();
    const lawyer = await Lawyer.create(body);
    const { password, ...safe } = lawyer.toObject();
    return NextResponse.json(safe, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create lawyer' }, { status: 500 });
  }
}

export async function PATCH(request) {
  await dbConnect();
  try {
    const updates = await request.json();
    const { id, ...fields } = updates;

    const lawyer = await Lawyer.findByIdAndUpdate(id, fields, { new: true }).select('-password');
    if (!lawyer) return NextResponse.json({ error: 'Lawyer not found' }, { status: 404 });

    return NextResponse.json(lawyer);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update lawyer' }, { status: 500 });
  }
}

export async function DELETE(request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const lawyer = await Lawyer.findByIdAndDelete(id);
    if (!lawyer) return NextResponse.json({ error: 'Lawyer not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete lawyer' }, { status: 500 });
  }
}
