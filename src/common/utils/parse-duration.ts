/**
 * Parses a duration string (e.g. "15m", "30d", "1h", "45s") into milliseconds.
 *
 * Supported units:
 * - `s` — seconds
 * - `m` — minutes
 * - `h` — hours
 * - `d` — days
 *
 * Falls back to 30 days if the format is unrecognized or the unit is unknown.
 *
 * @param duration - Duration string with a numeric value and a unit suffix.
 * @returns Equivalent duration in milliseconds.
 */
export function parseDurationToMs(duration: string): number {
  const match = duration.match(/(\d+)([smhd])/);
  if (!match) return 30 * 24 * 60 * 60 * 1000;
  const num = parseInt(match[1], 10);
  switch (match[2]) {
    case 's':
      return num * 1000;
    case 'm':
      return num * 60 * 1000;
    case 'h':
      return num * 60 * 60 * 1000;
    case 'd':
      return num * 24 * 60 * 60 * 1000;
    default:
      return 30 * 24 * 60 * 60 * 1000;
  }
}
