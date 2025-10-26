import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

export const dynamic = 'force-dynamic';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Filler words to remove
const FILLER_WORDS = [
  'um', 'uh', 'er', 'ah', 'like', 'you know', 'i mean', 'basically',
  'literally', 'actually', 'so', 'well', 'right', 'okay', 'hmm',
  'uhm', 'umm', 'erm', 'ehm'
];

function cleanTranscription(text: string): string {
  let cleaned = text;
  
  // Remove filler words (case insensitive, with word boundaries)
  FILLER_WORDS.forEach(filler => {
    const regex = new RegExp(`\\b${filler}\\b,?\\s*`, 'gi');
    cleaned = cleaned.replace(regex, '');
  });
  
  // Remove multiple spaces
  cleaned = cleaned.replace(/\s+/g, ' ');
  
  // Remove spaces before punctuation
  cleaned = cleaned.replace(/\s+([.,!?;:])/g, '$1');
  
  // Ensure proper spacing after punctuation
  cleaned = cleaned.replace(/([.,!?;:])([A-Za-z])/g, '$1 $2');
  
  // Capitalize first letter of sentences
  cleaned = cleaned.replace(/(^\w|[.!?]\s+\w)/g, (match) => match.toUpperCase());
  
  // Trim
  cleaned = cleaned.trim();
  
  return cleaned;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Transcribe with Groq Whisper
    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-large-v3',
      language: 'en',
      response_format: 'json',
      temperature: 0.0,
    });

    // Clean the transcription
    const cleanedText = cleanTranscription(transcription.text);

    // Optional: Further refine with LLM if needed (uncomment if you want extra polish)
    // const refinedText = await refineWithLLM(cleanedText);

    return NextResponse.json({
      text: cleanedText,
      original: transcription.text,
    });
  } catch (error: any) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to transcribe audio' },
      { status: 500 }
    );
  }
}

// Optional: Use Groq LLM to further refine transcription
async function refineWithLLM(text: string): Promise<string> {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a text refinement assistant. Clean up the given transcription by removing any remaining filler words, fixing grammar, and making it more concise while preserving the original meaning. Return ONLY the refined text, no explanations.',
        },
        {
          role: 'user',
          content: text,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.1,
      max_tokens: 2000,
    });

    return completion.choices[0]?.message?.content || text;
  } catch (error) {
    console.error('LLM refinement error:', error);
    return text; // Return original if refinement fails
  }
}

