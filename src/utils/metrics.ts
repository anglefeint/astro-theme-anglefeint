export function extractText(markdown: string): string {
	return markdown
		.replace(/```[\s\S]*?```/g, ' ')
		.replace(/`[^`]*`/g, ' ')
		.replace(/<[^>]+>/g, ' ')
		.replace(/!\[[^\]]*\]\([^)]+\)/g, ' ')
		.replace(/\[[^\]]+\]\([^)]+\)/g, ' ')
		.replace(/^#{1,6}\s+/gm, '')
		.replace(/[*_~>#-]/g, ' ')
		.replace(/\s+/g, ' ')
		.trim();
}

export function countWords(markdown: string): number {
	const text = extractText(markdown);
	if (!text) return 0;
	return text.split(/\s+/).filter(Boolean).length;
}

export function deriveMetrics(words: number) {
	const safeWords = Math.max(words, 1);
	return {
		readMinutes: Math.max(1, Math.ceil(safeWords / 220)),
		wordCount: words,
		tokenCount: Math.round(safeWords * 1.3),
		aiLatencyMs: Math.round(140 + Math.min(safeWords, 2800) * 0.11),
		aiConfidence: Number(Math.min(0.98, 0.78 + Math.log10(Math.max(safeWords, 20)) * 0.04).toFixed(2)),
	};
}
