export interface ParsedBlock {
  time: string;
  partySize: number;
}

export interface ParsedDiscount {
  percentOff: number;
  startTime: string;
  endTime: string;
}

// /block 19:00 4
const BLOCK_CMD = /^\/block\s+(\d{1,2}:\d{2})\s+(\d+)$/i;
// /unblock 19:00 4
const UNBLOCK_CMD = /^\/unblock\s+(\d{1,2}:\d{2})\s+(\d+)$/i;

const DISCOUNT_CMD =
  /^\/discount\s+(\d+)\s+(\d{1,2}:\d{2})-(\d{1,2}:\d{2})$/i;
const DISCOUNT_SHORT =
  /^(\d+)%\s+off\s+(?:tonight\s+)?(\d{1,2}:\d{2})-(\d{1,2}:\d{2})$/i;

export function parseBlock(text: string): ParsedBlock | null {
  const match = text.trim().match(BLOCK_CMD);
  if (!match) return null;
  return { time: match[1], partySize: parseInt(match[2], 10) };
}

export function parseUnblock(text: string): ParsedBlock | null {
  const match = text.trim().match(UNBLOCK_CMD);
  if (!match) return null;
  return { time: match[1], partySize: parseInt(match[2], 10) };
}

export interface ParsedLunch {
  price: number;
  description: string;
}

// /lunch 7.50 Cepelinai, salad, coffee
const LUNCH_CMD = /^\/lunch\s+(\d+(?:\.\d{1,2})?)\s+(.+)$/i;

export function parseLunch(text: string): ParsedLunch | null {
  const match = text.trim().match(LUNCH_CMD);
  if (!match) return null;
  return { price: parseFloat(match[1]), description: match[2].trim() };
}

export function parseDiscount(text: string): ParsedDiscount | null {
  const trimmed = text.trim();

  for (const pattern of [DISCOUNT_CMD, DISCOUNT_SHORT]) {
    const match = trimmed.match(pattern);
    if (match) {
      return {
        percentOff: parseInt(match[1], 10),
        startTime: match[2],
        endTime: match[3],
      };
    }
  }

  return null;
}
