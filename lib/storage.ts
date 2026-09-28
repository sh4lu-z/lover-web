import { ExperienceData } from '@/types/experience';
import fs from 'fs';
import path from 'path';
import { getExperiencesCollection, isMongoConfigured } from '@/lib/mongodb';

// Vercel serverless has a read-only filesystem except /tmp.
// Use /tmp on Vercel, .data/ locally for dev.
const IS_VERCEL = Boolean(process.env.VERCEL);
const DATA_DIR = IS_VERCEL
  ? path.join('/tmp', '.lover-data')
  : path.join(process.cwd(), '.data');
const DATA_FILE = path.join(DATA_DIR, 'experiences.json');

// Allowed reaction emojis — prevents NoSQL injection via reaction field paths
const ALLOWED_REACTIONS = new Set([
  '❤️', '💖', '🥰', '🌹', '✨', '💍', '💯', '😂', '🌸', '💌',
  '🔥', '😍', '💕', '🎉', '💗', '😘', '🤩', '💓', '❣️', '💝',
]);

export function isValidReaction(emoji: string): boolean {
  return ALLOWED_REACTIONS.has(emoji) && emoji.length <= 4;
}

// Input size limits to prevent resource exhaustion
export const MAX_SENDER_NAME = 50;
export const MAX_RECIPIENT_NAME = 50;
export const MAX_MESSAGE = 2000;
export const MAX_TITLE = 200;
export const MAX_SECONDARY_MSG = 500;
export const MAX_PHOTOS = 10;
export const MAX_QUIZ_QUESTIONS = 20;

// Maximum 30 days retention policy as requested (TTL = 30 days)
export const RETENTION_DAYS = 30;
export const RETENTION_MS = RETENTION_DAYS * 24 * 60 * 60 * 1000;

export function isExpired(dateString?: string): boolean {
  if (!dateString) return false;
  const time = new Date(dateString).getTime();
  if (isNaN(time)) return false;
  return Date.now() - time > RETENTION_MS;
}

export const INITIAL_EXPERIENCES: ExperienceData[] = [
  {
    id: 'exp_val_alex_mia',
    slug: 'alex-and-mia',
    type: 'valentine',
    theme: 'valentine',
    title: 'An Important Question for Mia 💕',
    senderName: 'Alex',
    recipientName: 'Mia',
    customQuestion: 'Will you be my Valentine?',
    message: 'Every moment with you feels like magic. I made this little universe just to ask you one special question...',
    secondaryMessage: 'I promise endless laughs, warm hugs, late-night boba, and loving you more every single day!',
    yesClicked: false,
    reactions: { '❤️': 12, '🥰': 9, '🌹': 7, '💍': 4, '✨': 15 },
    viewsCount: 142,
    uniqueViews: 98,
    sharesCount: 34,
    lastActivity: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'exp_love_sam_taylor',
    slug: 'sam-and-taylor',
    type: 'love_page',
    theme: 'romantic',
    title: 'To My One and Only Taylor',
    senderName: 'Sam',
    recipientName: 'Taylor',
    message: 'Looking back on every laughter-filled night, every quiet sunrise together, I realize home is not a place — it is anywhere you are.',
    secondaryMessage: '365 days of us, and my heart still skips a beat when your name lights up my phone. Here is to our forever chapter.',
    reactions: { '❤️': 24, '✨': 18, '💌': 11, '💖': 19 },
    viewsCount: 210,
    uniqueViews: 145,
    sharesCount: 42,
    lastActivity: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'exp_quiz_jordan',
    slug: 'jordan',
    type: 'quiz',
    theme: 'pink_glow',
    title: 'How Well Do You Really Know Jordan? 🕵️‍♀️',
    senderName: 'Jordan',
    recipientName: 'My Favorite Person',
    message: 'Think you know all my quirks, cravings, and secret habits? Take this quiz to prove your top-tier status!',
    quizQuestions: [
      {
        id: 'q1',
        question: 'What is my ultimate comfort food when I have had a long day?',
        options: ['Crispy Garlic Pizza', 'Spicy Ramen with Extra Egg', 'Fresh Tacos & Guacamole', 'Warm Chocolate Chip Cookies'],
        correctIndex: 1,
      },
      {
        id: 'q2',
        question: 'What would my dream impromptu weekend getaway look like?',
        options: ['A cozy cabin in the misty mountains', 'A sunny beachfront villa with sunset music', 'A bustling European city food crawl', 'Camping under the stars with hot cocoa'],
        correctIndex: 0,
      },
      {
        id: 'q3',
        question: 'Who falls asleep first during movie nights?',
        options: ['Always me, 15 minutes in', 'You, without a doubt!', 'We both stay awake miraculously', 'We never even finish picking the movie!'],
        correctIndex: 0,
      },
    ],
    reactions: { '💯': 15, '❤️': 20, '😂': 8 },
    viewsCount: 289,
    uniqueViews: 195,
    quizAttempts: 84,
    sharesCount: 61,
    lastActivity: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'exp_surprise_secret_heart',
    slug: 'for-you',
    type: 'surprise',
    theme: 'dreamy',
    title: 'A Sealed Secret Envelope 💌',
    senderName: 'Your Secret Admirer',
    recipientName: 'You',
    message: 'If I had a single flower for every time I thought of you, I could walk forever through a blossoming garden. You make ordinary days sparkle with joy.',
    secondaryMessage: 'Happy Valentine’s Day, my favorite human.',
    reactions: { '💖': 56, '🌸': 42, '✨': 38 },
    viewsCount: 340,
    uniqueViews: 260,
    sharesCount: 78,
    lastActivity: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let memoryExperiences: ExperienceData[] = [...INITIAL_EXPERIENCES];

// Track whether /tmp fs is writable (on Vercel /tmp works, but is ephemeral per invocation)
let fsWritable: boolean | null = null;

function canWriteFs(): boolean {
  if (fsWritable !== null) return fsWritable;
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    // Test write
    const testFile = path.join(DATA_DIR, '.write-test');
    fs.writeFileSync(testFile, 'ok', 'utf-8');
    fs.unlinkSync(testFile);
    fsWritable = true;
  } catch {
    fsWritable = false;
  }
  return fsWritable;
}

function ensureStorage(): void {
  if (!canWriteFs()) return;
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(INITIAL_EXPERIENCES, null, 2), 'utf-8');
    }
  } catch {
    // /tmp might be cleared between invocations — acceptable
  }
}

// Strip MongoDB internal _id field to match ExperienceData
function cleanMongoDoc(doc: any): ExperienceData {
  if (!doc) return doc;
  const { _id, expireAt, ...rest } = doc;
  return rest as ExperienceData;
}

export function sanitizeSlug(raw: string): string {
  return raw
    .toLowerCase()
    .replace(/[^a-z0-9\-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'love';
}

// ==========================================
// ASYNC STORAGE METHODS (MONGODB FIRST)
// ==========================================

export async function loadAllExperiencesAsync(): Promise<ExperienceData[]> {
  if (isMongoConfigured()) {
    try {
      const collection = await getExperiencesCollection();
      if (collection) {
        const docs = await collection
          .find({
            $or: [
              { expireAt: { $gt: new Date() } },
              { expireAt: { $exists: false } }
            ]
          })
          .sort({ createdAt: -1 })
          .toArray();

        if (docs && docs.length > 0) {
          const list = docs.map(cleanMongoDoc);
          memoryExperiences = list;
          return list;
        } else {
          // Seed initial experiences into MongoDB with 30-day expiration
          const now = Date.now();
          const expireAt = new Date(now + RETENTION_MS);
          const seeded = INITIAL_EXPERIENCES.map(e => ({ ...e, expireAt }));
          await collection.insertMany(seeded as any);
          return INITIAL_EXPERIENCES;
        }
      }
    } catch (err) {
      console.error('MongoDB load error, falling back to local store:', err);
    }
  }

  return loadAllExperiences();
}

export async function getExperiencesBySlugsAsync(slugs: string[]): Promise<ExperienceData[]> {
  if (!slugs || slugs.length === 0) return [];
  const normalizedSlugs = slugs.map(s => sanitizeSlug(s));

  if (isMongoConfigured()) {
    try {
      const collection = await getExperiencesCollection();
      if (collection) {
        const docs = await collection
          .find({
            $or: [
              { slug: { $in: normalizedSlugs } },
              { slug: { $in: slugs } },
              { id: { $in: slugs } }
            ]
          })
          .toArray();

        const valid = docs
          .filter(d => !d.createdAt || !isExpired(d.createdAt))
          .map(cleanMongoDoc);
        return valid;
      }
    } catch (err) {
      console.error('MongoDB getExperiencesBySlugs error:', err);
    }
  }

  const all = loadAllExperiences();
  return all.filter(e => normalizedSlugs.includes(sanitizeSlug(e.slug)) || slugs.includes(e.id));
}

export async function getExperienceBySlugAsync(slug: string): Promise<ExperienceData | null> {
  const normalized = sanitizeSlug(slug);

  if (isMongoConfigured()) {
    try {
      const collection = await getExperiencesCollection();
      if (collection) {
        const doc = await collection.findOne({
          $or: [
            { slug: normalized },
            { slug: slug },
            { id: slug }
          ]
        });

        if (doc) {
          // Check 30-day expiration policy
          if (doc.createdAt && isExpired(doc.createdAt)) {
            await collection.deleteOne({ _id: (doc as any)._id });
            return null;
          }
          return cleanMongoDoc(doc);
        }
      }
    } catch (err) {
      console.error('MongoDB getExperienceBySlug error:', err);
    }
  }

  return getExperienceBySlug(slug);
}

export async function isSlugAvailableAsync(slug: string, currentId?: string): Promise<boolean> {
  const normalized = sanitizeSlug(slug);
  const reserved = ['api', 'vault', 'games', 'discover', 'create', 'about', 'login', 'terms'];
  if (reserved.includes(normalized)) return false;

  if (isMongoConfigured()) {
    try {
      const collection = await getExperiencesCollection();
      if (collection) {
        const query: any = { slug: normalized };
        if (currentId) {
          query.id = { $ne: currentId };
        }
        const existing = await collection.findOne(query);
        return !existing;
      }
    } catch (err) {
      console.error('MongoDB isSlugAvailable error:', err);
    }
  }

  return isSlugAvailable(slug, currentId);
}

export async function saveExperienceAsync(
  data: Partial<ExperienceData> & { senderName: string; type: ExperienceData['type'] }
): Promise<ExperienceData> {
  const now = new Date().toISOString();
  const expireAt = new Date(Date.now() + RETENTION_MS); // Auto-deletes in 30 days

  const rawSlug = data.slug?.trim() ? sanitizeSlug(data.slug) : '';
  let candidateSlug = rawSlug;

  if (!candidateSlug) {
    const nameForSlug = data.recipientName
      ? `${data.senderName}-and-${data.recipientName}`
      : data.senderName;
    const baseSlug = sanitizeSlug(nameForSlug);
    candidateSlug = baseSlug;

    let counter = 1;
    while (!(await isSlugAvailableAsync(candidateSlug, data.id))) {
      counter++;
      candidateSlug = `${baseSlug}-${counter}`;
    }
  }

  const id = data.id || `exp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const newExp: ExperienceData = {
    id,
    slug: candidateSlug,
    type: data.type,
    theme: data.theme || 'romantic',
    title: data.title || (data.recipientName ? `A Love Note for ${data.recipientName}` : 'A Special Experience'),
    senderName: data.senderName.trim(),
    recipientName: (data.recipientName || '').trim(),
    message: data.message || '',
    secondaryMessage: data.secondaryMessage,
    customQuestion: data.customQuestion,
    photos: data.photos || [],
    revealType: data.revealType || 'scratch',
    revealDate: data.revealDate,
    quizQuestions: data.quizQuestions,
    quizAnswers: data.quizAnswers,
    thisOrThatItems: data.thisOrThatItems,
    timelineItems: data.timelineItems,
    countdownConfig: data.countdownConfig,
    dateIdeas: data.dateIdeas,
    yesClicked: data.yesClicked || false,
    yesTimestamp: data.yesTimestamp,
    reactions: data.reactions || { '❤️': 1 },
    viewsCount: data.viewsCount || 1,
    uniqueViews: data.uniqueViews || 1,
    sharesCount: data.sharesCount || 0,
    quizAttempts: data.quizAttempts || 0,
    lastActivity: now,
    createdAt: data.createdAt || now,
    updatedAt: now,
  };

  if (isMongoConfigured()) {
    try {
      const collection = await getExperiencesCollection();
      if (collection) {
        await collection.updateOne(
          { $or: [{ id }, { slug: candidateSlug }] },
          { $set: { ...newExp, expireAt } },
          { upsert: true }
        );
        // Also update memory cache
        const idx = memoryExperiences.findIndex(e => e.id === id || e.slug === candidateSlug);
        if (idx >= 0) memoryExperiences[idx] = newExp;
        else memoryExperiences.unshift(newExp);

        return newExp;
      }
    } catch (err) {
      console.error('MongoDB save error, falling back to local:', err);
    }
  }

  // Fallback to local
  return saveExperience({ ...data, slug: candidateSlug, id });
}

export async function updateExperienceStatsAsync(
  slug: string,
  updates: {
    incrementView?: boolean;
    incrementShare?: boolean;
    incrementQuizAttempt?: boolean;
    reaction?: string;
    yesClicked?: boolean;
  }
): Promise<ExperienceData | null> {
  const normalized = sanitizeSlug(slug);

  if (isMongoConfigured()) {
    try {
      const collection = await getExperiencesCollection();
      if (collection) {
        const updateOps: any = {
          $set: {
            lastActivity: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        };

        const incOps: any = {};
        if (updates.incrementView) {
          incOps.viewsCount = 1;
          incOps.uniqueViews = 1;
        }
        if (updates.incrementShare) incOps.sharesCount = 1;
        if (updates.incrementQuizAttempt) incOps.quizAttempts = 1;
        // Only allow whitelisted emoji reactions to prevent NoSQL injection
        if (updates.reaction && isValidReaction(updates.reaction)) {
          incOps[`reactions.${updates.reaction}`] = 1;
        }

        if (Object.keys(incOps).length > 0) {
          updateOps.$inc = incOps;
        }

        if (updates.yesClicked) {
          updateOps.$set.yesClicked = true;
          updateOps.$set.yesTimestamp = new Date().toISOString();
        }

        const result = await collection.findOneAndUpdate(
          { $or: [{ slug: normalized }, { slug }, { id: slug }] },
          updateOps,
          { returnDocument: 'after' }
        );

        if (result) {
          return cleanMongoDoc(result);
        }
      }
    } catch (err) {
      console.error('MongoDB updateExperienceStats error:', err);
    }
  }

  return updateExperienceStats(slug, updates);
}

export async function deleteExperienceAsync(slug: string): Promise<boolean> {
  const normalized = sanitizeSlug(slug);

  if (isMongoConfigured()) {
    try {
      const collection = await getExperiencesCollection();
      if (collection) {
        const res = await collection.deleteOne({
          $or: [{ slug: normalized }, { slug }, { id: slug }]
        });
        deleteExperience(slug);
        return res.deletedCount > 0;
      }
    } catch (err) {
      console.error('MongoDB delete error:', err);
    }
  }

  return deleteExperience(slug);
}

// ==========================================
// SYNCHRONOUS FALLBACK METHODS
// (For offline, local dev, or synchronous hooks)
// ==========================================

export function loadAllExperiences(): ExperienceData[] {
  try {
    ensureStorage();
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Filter out expired items (> 30 days)
        const valid = parsed.filter(e => !isExpired(e.createdAt));
        memoryExperiences = valid;
        return valid;
      }
    }
  } catch {
    // fallback to memory
  }
  return memoryExperiences.filter(e => !isExpired(e.createdAt));
}

export function saveAllExperiences(items: ExperienceData[]): void {
  const valid = items.filter(e => !isExpired(e.createdAt));
  memoryExperiences = valid;
  try {
    ensureStorage();
    fs.writeFileSync(DATA_FILE, JSON.stringify(valid, null, 2), 'utf-8');
  } catch {
    // in-memory persists
  }
}

export function getExperienceBySlug(slug: string): ExperienceData | null {
  const all = loadAllExperiences();
  const normalized = slug.toLowerCase().trim();
  const found = all.find(e => e.slug.toLowerCase() === normalized || e.id === slug);
  if (found && isExpired(found.createdAt)) return null;
  return found || null;
}

export function isSlugAvailable(slug: string, currentId?: string): boolean {
  const normalized = sanitizeSlug(slug);
  const all = loadAllExperiences();
  const reserved = ['api', 'vault', 'games', 'discover', 'create', 'about', 'login', 'terms'];
  if (reserved.includes(normalized)) return false;
  return !all.some(e => e.slug === normalized && e.id !== currentId);
}

export function createSlug(names: string, _type: string): string {
  const base = sanitizeSlug(names);
  const all = loadAllExperiences();
  let candidate = base;
  let counter = 1;
  while (all.some(e => e.slug === candidate)) {
    counter++;
    candidate = `${base}-${counter}`;
  }
  return candidate;
}

export function saveExperience(data: Partial<ExperienceData> & { senderName: string; type: ExperienceData['type'] }): ExperienceData {
  const all = loadAllExperiences();
  const now = new Date().toISOString();

  const rawSlug = data.slug?.trim() ? sanitizeSlug(data.slug) : '';
  const nameForSlug = rawSlug || (
    data.recipientName 
      ? `${data.senderName}-and-${data.recipientName}` 
      : data.senderName
  );

  const slug = rawSlug || createSlug(nameForSlug, data.type);
  const id = data.id || `exp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  const newExp: ExperienceData = {
    id,
    slug,
    type: data.type,
    theme: data.theme || 'romantic',
    title: data.title || (data.recipientName ? `A Love Note for ${data.recipientName}` : 'A Special Experience'),
    senderName: data.senderName.trim(),
    recipientName: (data.recipientName || '').trim(),
    message: data.message || '',
    secondaryMessage: data.secondaryMessage,
    customQuestion: data.customQuestion,
    photos: data.photos || [],
    revealType: data.revealType || 'scratch',
    revealDate: data.revealDate,
    quizQuestions: data.quizQuestions,
    quizAnswers: data.quizAnswers,
    thisOrThatItems: data.thisOrThatItems,
    timelineItems: data.timelineItems,
    countdownConfig: data.countdownConfig,
    dateIdeas: data.dateIdeas,
    yesClicked: data.yesClicked || false,
    yesTimestamp: data.yesTimestamp,
    reactions: data.reactions || { '❤️': 1 },
    viewsCount: data.viewsCount || 1,
    uniqueViews: data.uniqueViews || 1,
    sharesCount: data.sharesCount || 0,
    quizAttempts: data.quizAttempts || 0,
    lastActivity: now,
    createdAt: data.createdAt || now,
    updatedAt: now,
  };

  const existingIdx = all.findIndex(e => e.id === id || e.slug === slug);
  if (existingIdx >= 0) {
    all[existingIdx] = { ...all[existingIdx], ...newExp, updatedAt: now };
  } else {
    all.unshift(newExp);
  }

  saveAllExperiences(all);
  return newExp;
}

export function updateExperienceStats(slug: string, updates: { 
  incrementView?: boolean;
  incrementShare?: boolean;
  incrementQuizAttempt?: boolean;
  reaction?: string;
  yesClicked?: boolean;
}): ExperienceData | null {
  const all = loadAllExperiences();
  const exp = all.find(e => e.slug.toLowerCase() === slug.toLowerCase() || e.id === slug);
  if (!exp) return null;

  if (updates.incrementView) {
    exp.viewsCount = (exp.viewsCount || 0) + 1;
    exp.uniqueViews = (exp.uniqueViews || Math.floor(exp.viewsCount * 0.7)) + 1;
  }
  if (updates.incrementShare) exp.sharesCount = (exp.sharesCount || 0) + 1;
  if (updates.incrementQuizAttempt) exp.quizAttempts = (exp.quizAttempts || 0) + 1;
  if (updates.reaction && isValidReaction(updates.reaction)) {
    exp.reactions = exp.reactions || {};
    exp.reactions[updates.reaction] = (exp.reactions[updates.reaction] || 0) + 1;
  }
  if (updates.yesClicked) {
    exp.yesClicked = true;
    exp.yesTimestamp = new Date().toISOString();
  }
  exp.lastActivity = new Date().toISOString();
  exp.updatedAt = new Date().toISOString();

  saveAllExperiences(all);
  return exp;
}

export function deleteExperience(slug: string): boolean {
  const all = loadAllExperiences();
  const initialLen = all.length;
  const filtered = all.filter(e => e.slug.toLowerCase() !== slug.toLowerCase() && e.id !== slug);
  if (filtered.length !== initialLen) {
    saveAllExperiences(filtered);
    return true;
  }
  return false;
}
