import { NextRequest, NextResponse } from 'next/server';
import {
  getExperienceBySlugAsync,
  updateExperienceStatsAsync,
  deleteExperienceAsync,
  isValidReaction,
} from '@/lib/storage';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const experience = await getExperienceBySlugAsync(slug);

    if (!experience) {
      return NextResponse.json({ success: false, error: 'Experience not found' }, { status: 404 });
    }

    // Record view asynchronously (fire-and-forget for speed on serverless)
    updateExperienceStatsAsync(slug, { incrementView: true }).catch(() => {});

    return NextResponse.json({ success: true, experience });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await req.json();

    // Validate reaction emoji if provided
    if (body.reaction && !isValidReaction(body.reaction)) {
      return NextResponse.json(
        { success: false, error: 'Invalid reaction emoji.' },
        { status: 400 }
      );
    }

    const updated = await updateExperienceStatsAsync(slug, {
      incrementShare: body.incrementShare,
      incrementQuizAttempt: body.incrementQuizAttempt,
      reaction: body.reaction,
      yesClicked: body.yesClicked,
    });

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Experience not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, experience: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Basic authorization: require the experience ID as a delete token.
    // The creator has this ID stored in their localStorage vault.
    // This prevents random users from deleting other people's experiences.
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token') || req.headers.get('x-delete-token');

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Delete token required. Only the creator can delete this experience.' },
        { status: 403 }
      );
    }

    // Verify the token matches the experience's ID
    const experience = await getExperienceBySlugAsync(slug);
    if (!experience) {
      return NextResponse.json({ success: false, error: 'Experience not found' }, { status: 404 });
    }

    if (experience.id !== token) {
      return NextResponse.json(
        { success: false, error: 'Invalid delete token. You are not the creator of this experience.' },
        { status: 403 }
      );
    }

    const deleted = await deleteExperienceAsync(slug);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Failed to delete experience' }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: 'Experience deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
  }
}
