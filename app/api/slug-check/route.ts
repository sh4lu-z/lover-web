import { NextRequest, NextResponse } from 'next/server';
import { isSlugAvailableAsync, sanitizeSlug } from '@/lib/storage';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawSlug = searchParams.get('slug') || '';
  const currentId = searchParams.get('currentId') || undefined;

  const sanitized = sanitizeSlug(rawSlug);
  const available = await isSlugAvailableAsync(sanitized, currentId);

  return NextResponse.json({
    slug: sanitized,
    available,
  });
}
