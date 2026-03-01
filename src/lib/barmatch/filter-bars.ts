import type { Bar, SessionFilters } from './types';

export function filterBars(bars: Bar[], filters: SessionFilters): Bar[] {
  return bars.filter((bar) => {
    // Price range filter
    if (filters.priceRange && bar.priceLevel != null) {
      const [min, max] = filters.priceRange;
      if (bar.priceLevel < min || bar.priceLevel > max) return false;
    }

    // Open now filter
    if (filters.openNow && bar.openNow === false) return false;

    // Outdoor seating filter
    if (filters.outdoorOnly && !bar.outdoorSeating) return false;

    return true;
  });
}
