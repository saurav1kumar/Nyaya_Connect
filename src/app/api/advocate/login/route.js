import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Lawyer from '@/models/Lawyer';

export async function POST(request) {
  await dbConnect();
  try {
    const { name, password } = await request.json();

    const lawyer = await Lawyer.findOne({
      name: { $regex: new RegExp(`^${name}$`, 'i') },
      password
    });

    if (!lawyer) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const { password: _, ...safeProfile } = lawyer.toObject();
    // Use string ID for client-side consistency
    safeProfile.id = lawyer._id.toString(); 
    
    return NextResponse.json({ success: true, advocate: safeProfile });
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}
