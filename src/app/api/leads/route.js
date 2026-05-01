import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const leadsPath = path.join(process.cwd(), 'src/data/leads.json');

function getLeads() {
  const data = fs.readFileSync(leadsPath, 'utf8');
  return JSON.parse(data);
}

function saveLeads(leads) {
  fs.writeFileSync(leadsPath, JSON.stringify(leads, null, 2));
}

export async function GET() {
  try {
    const leads = getLeads();
    return NextResponse.json(leads);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const newLead = await request.json();
    const leads = getLeads();
    
    const leadWithId = {
      ...newLead,
      id: `LD-${1001 + leads.length}`, // Simple ID generation
      status: 'NEW',
      createdAt: new Date().toISOString(),
      assignedLawyer: null,
    };
    
    leads.unshift(leadWithId);
    saveLeads(leads);
    
    return NextResponse.json(leadWithId, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create lead' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { leadId, lawyerName, status } = await request.json();
    const leads = getLeads();
    
    const index = leads.findIndex(l => l.id === leadId);
    if (index === -1) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }
    
    leads[index] = {
      ...leads[index],
      assignedLawyer: lawyerName || leads[index].assignedLawyer,
      status: status || leads[index].status,
    };
    
    saveLeads(leads);
    return NextResponse.json(leads[index]);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update lead' }, { status: 500 });
  }
}
