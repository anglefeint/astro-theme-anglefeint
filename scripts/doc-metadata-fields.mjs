export function metadataStringIssues(parsed) {
  const issues = [];
  for (const key of ['doc_id', 'doc_role', 'doc_purpose']) {
    if (!(key in parsed)) continue;
    if (typeof parsed[key] !== 'string' || !parsed[key].trim()) {
      issues.push(`field '${key}' must be a non-empty string`);
    }
  }
  return issues;
}
