import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export const dynamic = 'force-dynamic';

// GET all conversations
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db('alpha');
    
    const conversations = await db
      .collection('conversations')
      .find({})
      .sort({ updatedAt: -1 })
      .toArray();

    return NextResponse.json({ conversations });
  } catch (error: any) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}

// POST create new conversation
export async function POST(req: NextRequest) {
  try {
    const { title, messages, systemPrompt } = await req.json();
    
    const client = await clientPromise;
    const db = client.db('alpha');
    
    const conversation = {
      title: title || 'New Conversation',
      messages: messages || [],
      systemPrompt: systemPrompt || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection('conversations').insertOne(conversation);

    return NextResponse.json({
      conversation: { ...conversation, _id: result.insertedId },
    });
  } catch (error: any) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}

