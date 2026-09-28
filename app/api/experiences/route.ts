import { NextRequest, NextResponse } from 'next/server';
import {
  getExperiencesBySlugsAsync,
  saveExperienceAsync,
  INITIAL_EXPERIENCES,
  MAX_SENDER_NAME,
  MAX_RECIPIENT_NAME,
  MAX_MESSAGE,
  MAX_TITLE,
  MAX_SECONDARY_MSG,
  MAX_PHOTOS,
  MAX_QUIZ_QUESTIONS,
} from '@/lib/storage';
import { ExperienceType } from '@/types/experience';

// Valid experience types to prevent arbitrary type injection
const VALID_TYPES: ExperienceType[] = [
  'love_page', 'valentine', 'quiz', 'surprise', 'love_letter',
  'countdown', 'timeline', 'compatibility', 'date_wheel',
  'this_or_that', 'memory_match', 'would_you_rather',
  'truth_or_dare', 'personality_test', 'love_challenge', 'emoji_quiz',
];

// Max slugs in a single GET request to prevent abuse
const MAX_SLUGS_PER_REQUEST = 50;

function truncate(val: string | undefined, max: number): string {
  if (!val) return '';
  return val.slice(0, max);
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slugsParam = searchParams.get('slugs');
    const type = searchParams.get('type');

    let experiences;

    if (slugsParam) {
      const slugs = slugsParam
        .split(',')
        .map(s => s.trim())
        .filter(Boolean)
        .slice(0, MAX_SLUGS_PER_REQUEST); // Limit query size
      experiences = await getExperiencesBySlugsAsync(slugs);
    } else {
      // Privacy Protection: Only serve the default sample templates
      experiences = INITIAL_EXPERIENCES;
    }

    if (type) {
      experiences = experiences.filter(e => e.type === type);
    }

    return NextResponse.json({ success: true, experiences });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.senderName || !body.type) {
      return NextResponse.json(
        { success: false, error: 'Sender name and experience type are required.' },
        { status: 400 }
      );
    }

    // Validate experience type
    if (!VALID_TYPES.includes(body.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid experience type.' },
        { status: 400 }
      );
    }

    // Sanitize and truncate inputs to prevent oversized payloads
    const sanitizedBody = {
      ...body,
      senderName: truncate(body.senderName, MAX_SENDER_NAME),
      recipientName: truncate(body.recipientName, MAX_RECIPIENT_NAME),
      message: truncate(body.message, MAX_MESSAGE),
      title: truncate(body.title, MAX_TITLE),
      secondaryMessage: truncate(body.secondaryMessage, MAX_SECONDARY_MSG),
      customQuestion: truncate(body.customQuestion, MAX_TITLE),
      photos: Array.isArray(body.photos) ? body.photos.slice(0, MAX_PHOTOS) : [],
      quizQuestions: Array.isArray(body.quizQuestions) ? body.quizQuestions.slice(0, MAX_QUIZ_QUESTIONS) : undefined,
    };

    const created = await saveExperienceAsync(sanitizedBody);
    return NextResponse.json({ success: true, experience: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
