export function rnaCustomFormat(data: string): boolean {
  return /^[0-9]{4}[A-Z]{1}$/.test(data);
}