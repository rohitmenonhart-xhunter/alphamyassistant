import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

// GET context data
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('alpha');
    
    const context = await db.collection('context').findOne({ userId: 'rohit' });

    return NextResponse.json({ context: context || null });
  } catch (error: any) {
    console.error('Error fetching context:', error);
    return NextResponse.json(
      { error: 'Failed to fetch context' },
      { status: 500 }
    );
  }
}

// POST/PUT update context
export async function POST(req: NextRequest) {
  try {
    const contextData = await req.json();
    
    const client = await clientPromise;
    const db = client.db('alpha');
    
    const result = await db.collection('context').updateOne(
      { userId: 'rohit' },
      {
        $set: {
          ...contextData,
          userId: 'rohit',
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating context:', error);
    return NextResponse.json(
      { error: 'Failed to update context' },
      { status: 500 }
    );
  }
}

