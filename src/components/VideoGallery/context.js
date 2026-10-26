import {createContext} from 'react';

// The active series filter on the Video demos page: 'all', 'marvin', or 'gento'.
export const VideoFilterContext = createContext('all');

// Which product series a video belongs to: Marvin Series (Marvin, Marvin Pro) or
// Gento Series (Luna, Skye), taken from the card's tag. Set `series` on a VideoCard to override.
export function seriesOf({series, tag}) {
  if (series) return series;
  if (/^marvin/i.test(tag || '')) return 'marvin';
  if (/^(luna|skye)$/i.test(tag || '')) return 'gento';
  return null;
}
