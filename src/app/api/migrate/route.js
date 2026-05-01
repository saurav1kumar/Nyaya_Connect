import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Lawyer from '@/models/Lawyer';
import Settings from '@/models/Settings';
import fs from 'fs';
import path from 'path';

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Migration restricted' }, { status: 403 });
  }

  await dbConnect();
  
  const lawyersPath = path.join(process.cwd(), 'src/data/lawyers.json');
  if (fs.existsSync(lawyersPath)) {
    const lawyersData = JSON.parse(fs.readFileSync(lawyersPath, 'utf8'));
    for (const l of lawyersData) {
      const { id, ...data } = l;
      await Lawyer.findOneAndUpdate({ name: data.name }, data, { upsert: true });
    }
  }

  const settingsPath = path.join(process.cwd(), 'src/data/settings.json');
  if (fs.existsSync(settingsPath)) {
    const settingsData = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    await Settings.findOneAndUpdate({ key: 'platform_settings' }, settingsData, { upsert: true });
  }

  return NextResponse.json({ success: true, message: 'Data migrated to MongoDB' });
}
