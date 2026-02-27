import type { Neighborhood } from './types';

export const neighborhoods: Neighborhood[] = [
  // Berlin
  { id: 'kreuzberg', name: 'Kreuzberg', city: 'Berlin', lat: 52.4894, lng: 13.4025 },
  { id: 'friedrichshain', name: 'Friedrichshain', city: 'Berlin', lat: 52.5158, lng: 13.4537 },
  { id: 'neukoelln', name: 'Neukölln', city: 'Berlin', lat: 52.4811, lng: 13.4350 },
  { id: 'mitte', name: 'Mitte', city: 'Berlin', lat: 52.5200, lng: 13.4050 },
  { id: 'prenzlauer-berg', name: 'Prenzlauer Berg', city: 'Berlin', lat: 52.5388, lng: 13.4244 },
  { id: 'charlottenburg', name: 'Charlottenburg', city: 'Berlin', lat: 52.5160, lng: 13.3040 },
  { id: 'schoeneberg', name: 'Schöneberg', city: 'Berlin', lat: 52.4841, lng: 13.3530 },
  { id: 'wedding', name: 'Wedding', city: 'Berlin', lat: 52.5490, lng: 13.3595 },
  // Hamburg
  { id: 'st-pauli', name: 'St. Pauli', city: 'Hamburg', lat: 53.5525, lng: 9.9631 },
  { id: 'sternschanze', name: 'Sternschanze', city: 'Hamburg', lat: 53.5632, lng: 9.9632 },
  // Munich
  { id: 'glockenbachviertel', name: 'Glockenbachviertel', city: 'München', lat: 48.1291, lng: 11.5718 },
  { id: 'schwabing', name: 'Schwabing', city: 'München', lat: 48.1614, lng: 11.5861 },
];

/** Get neighborhoods grouped by city */
export function getNeighborhoodsByCity(): Record<string, Neighborhood[]> {
  const grouped: Record<string, Neighborhood[]> = {};
  for (const n of neighborhoods) {
    if (!grouped[n.city]) grouped[n.city] = [];
    grouped[n.city].push(n);
  }
  return grouped;
}
