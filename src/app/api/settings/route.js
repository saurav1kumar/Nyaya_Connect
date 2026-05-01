import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Settings from '@/models/Settings';

export async function GET() {
  await dbConnect();
  try {
    let settings = await Settings.findOne({ key: 'platform_settings' });
    if (!settings) settings = await Settings.create({ key: 'platform_settings' });
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
  }
}

export async function PATCH(request) {
  await dbConnect();
  try {
    const updates = await request.json();
    const settings = await Settings.findOneAndUpdate(
      { key: 'platform_settings' },
      { $set: updates },
      { new: true, upsert: true }
    );
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
