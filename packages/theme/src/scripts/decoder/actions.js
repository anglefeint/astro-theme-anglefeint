export async function copyResult(text) {
  await navigator.clipboard.writeText(text);
}
export function downloadResult(records) {
  const url = URL.createObjectURL(
    new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' })
  );
  const link = document.createElement('a');
  link.href = url;
  link.download = 'decoder-results.json';
  link.click();
  // Do not revoke before the browser has consumed the click.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
