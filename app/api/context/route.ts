import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

// GET context data
export async function GET() {
  try {
    // Check if MongoDB URI is configured
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not set in environment variables');
      return NextResponse.json(
        { error: 'Database not configured', context: null },
        { status: 200 }  // Return 200 to allow fallback to localStorage
      );
    }

    const client = await clientPromise;
    const db = client.db('alpha');
    
    const context = await db.collection('context').findOne({ userId: 'rohit' });

    return NextResponse.json({ context: context || null });
  } catch (error: any) {
    console.error('Error fetching context:', error);
    console.error('Error details:', error.message);
    // Return 200 with null to allow fallback to localStorage
    return NextResponse.json(
      { error: 'Failed to fetch context', context: null },
      { status: 200 }
    );
  }
}

// POST/PUT update context
export async function POST(req: NextRequest) {
  try {
    // Check if MongoDB URI is configured
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI is not set in environment variables');
      return NextResponse.json(
        { error: 'Database not configured', success: false },
        { status: 200 }
      );
    }

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
    console.error('Error details:', error.message);
    return NextResponse.json(
      { error: 'Failed to update context', success: false },
      { status: 200 }
    );
  }
}

