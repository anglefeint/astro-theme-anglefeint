export type DeepPartial<T> = {
	[K in keyof T]?: T[K] extends Array<infer U>
		? Array<DeepPartial<U>>
		: T[K] extends object
			? DeepPartial<T[K]>
			: T[K];
};

export function isPlainObject(value: unknown): value is Record<string, unknown> {
	return Object.prototype.toString.call(value) === '[object Object]';
}

export function deepMerge<T>(base: T, override: DeepPartial<T>): T {
	if (!isPlainObject(base) || !isPlainObject(override)) return (override as T) ?? base;

	const result: Record<string, unknown> = { ...(base as Record<string, unknown>) };
	for (const [key, value] of Object.entries(override)) {
		if (value === undefined) continue;
		const existing = result[key];
		if (Array.isArray(value)) {
			result[key] = value;
			continue;
		}
		if (isPlainObject(existing) && isPlainObject(value)) {
			result[key] = deepMerge(existing, value);
			continue;
		}
		result[key] = value;
	}
	return result as T;
}
