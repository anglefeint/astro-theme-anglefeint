import { clamp, int } from './number';
export type PaginationItem = { kind: 'page'; page: number } | { kind: 'ellipsis'; id: string };

export interface PaginationModel {
  currentPage: number;
  totalPages: number;
  showJump: boolean;
  items: PaginationItem[];
}

interface BuildPaginationModelOptions {
  currentPage: number;
  totalPages: number;
  windowSize?: number;
  showJumpThreshold?: number;
}

function addRange(set: Set<number>, start: number, end: number, totalPages: number) {
  const s = clamp(int(start), 1, totalPages);
  const e = clamp(int(end), 1, totalPages);
  for (let page = s; page <= e; page += 1) set.add(page);
}

export function buildPaginationModel(options: BuildPaginationModelOptions): PaginationModel {
  const totalPages = Math.max(1, int(options.totalPages));
  const currentPage = clamp(int(options.currentPage), 1, totalPages);
  const windowSize = clamp(int(options.windowSize ?? 7), 5, 21);
  const showJumpThreshold = Math.max(1, int(options.showJumpThreshold ?? 12));
  const showJump = totalPages > showJumpThreshold;

  if (totalPages <= windowSize) {
    return {
      currentPage,
      totalPages,
      showJump,
      items: Array.from({ length: totalPages }, (_, i) => ({ kind: 'page', page: i + 1 })),
    };
  }

  const boundaryCount = 1;
  const siblingCount = Math.max(1, Math.floor((windowSize - (boundaryCount * 2 + 3)) / 2));
  const nearEdgeSlots = boundaryCount + siblingCount * 2 + 2;
  const picked = new Set<number>();

  addRange(picked, 1, boundaryCount, totalPages);
  addRange(picked, totalPages - boundaryCount + 1, totalPages, totalPages);
  addRange(picked, currentPage - siblingCount, currentPage + siblingCount, totalPages);

  if (currentPage <= nearEdgeSlots) addRange(picked, 1, nearEdgeSlots + 1, totalPages);
  if (currentPage >= totalPages - nearEdgeSlots + 1)
    addRange(picked, totalPages - nearEdgeSlots, totalPages, totalPages);

  const pages = [...picked].sort((a, b) => a - b);
  const items: PaginationItem[] = [];
  for (let i = 0; i < pages.length; i += 1) {
    const page = pages[i];
    const prev = pages[i - 1];
    if (typeof prev === 'number' && page - prev > 1) {
      items.push({ kind: 'ellipsis', id: `ellipsis-${prev}-${page}` });
    }
    items.push({ kind: 'page', page });
  }

  return { currentPage, totalPages, showJump, items };
}
