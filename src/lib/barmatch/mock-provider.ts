import type { Bar, BarDetails, BarDataProvider, NearbyParams } from './types';
import { distanceMeters } from './utils';

const MOCK_BARS: Omit<Bar, 'distance'>[] = [
  { id: 'mock-1', name: 'Zur wilden Renate', lat: 52.5073, lng: 13.4570, types: ['nightclub', 'bar'], address: 'Alt-Stralau 70', openingHours: 'Fr-Sa 00:00-08:00', outdoorSeating: true },
  { id: 'mock-2', name: 'Kreuzberger Himmel', lat: 52.4916, lng: 13.3924, types: ['bar', 'cocktail'], address: 'Yorckstr. 28', openingHours: 'Mo-Su 18:00-02:00', smoking: 'outside' },
  { id: 'mock-3', name: 'Goldener Hahn', lat: 52.4934, lng: 13.4171, types: ['pub', 'brewery'], address: 'Graefestr. 15', openingHours: 'Mo-Su 16:00-01:00', smoking: 'yes' },
  { id: 'mock-4', name: 'Prater Garten', lat: 52.5408, lng: 13.4166, types: ['biergarten', 'pub'], address: 'Kastanienallee 7-9', openingHours: 'Mo-Su 12:00-00:00', outdoorSeating: true },
  { id: 'mock-5', name: 'Monkey Bar', lat: 52.5054, lng: 13.3363, types: ['cocktail', 'bar'], address: 'Budapester Str. 40', openingHours: 'Mo-Su 12:00-02:00' },
  { id: 'mock-6', name: 'Klunkerkranich', lat: 52.4805, lng: 13.4314, types: ['bar', 'biergarten'], address: 'Karl-Marx-Str. 66', openingHours: 'Mo-Su 10:00-01:30', outdoorSeating: true },
  { id: 'mock-7', name: 'Salon zur Wilden Renate', lat: 52.5076, lng: 13.4574, types: ['bar'], address: 'Alt-Stralau 70', openingHours: 'We-Su 18:00-04:00' },
  { id: 'mock-8', name: 'Das Hotel', lat: 52.5025, lng: 13.4453, types: ['bar', 'cocktail'], address: 'Mariannenstr. 26A', openingHours: 'Tu-Sa 20:00-04:00', smoking: 'yes' },
  { id: 'mock-9', name: 'Mein Haus am See', lat: 52.5268, lng: 13.3955, types: ['bar', 'pub'], address: 'Brunnenstr. 197-198', openingHours: 'Mo-Su 00:00-24:00' },
  { id: 'mock-10', name: 'Ritter Butzke', lat: 52.5049, lng: 13.4127, types: ['nightclub'], address: 'Ritterstr. 26', openingHours: 'Fr-Sa 23:00-08:00' },
  { id: 'mock-11', name: 'Luzia', lat: 52.4982, lng: 13.4291, types: ['bar'], address: 'Oranienstr. 34', openingHours: 'Mo-Su 11:00-03:00', outdoorSeating: true },
  { id: 'mock-12', name: 'Madame Claude', lat: 52.4968, lng: 13.4344, types: ['bar', 'pub'], address: 'Lübbener Str. 19', openingHours: 'Mo-Su 19:00-05:00' },
  { id: 'mock-13', name: 'Schwarze Traube', lat: 52.4881, lng: 13.4415, types: ['cocktail', 'bar'], address: 'Weigandufer 6', openingHours: 'Tu-Sa 20:00-03:00' },
  { id: 'mock-14', name: 'Bryk Bar', lat: 52.5192, lng: 13.4065, types: ['cocktail', 'bar'], address: 'Alte Schönhauser Str. 44', openingHours: 'Mo-Sa 19:00-03:00' },
  { id: 'mock-15', name: 'Geist im Glas', lat: 52.4856, lng: 13.4352, types: ['bar', 'cocktail'], address: 'Lenaustr. 27', openingHours: 'Tu-Sa 20:00-03:00' },
  { id: 'mock-16', name: 'Eschenbräu', lat: 52.5494, lng: 13.3548, types: ['pub', 'brewery'], address: 'Triftstr. 67', openingHours: 'Mo-Su 15:00-00:00', outdoorSeating: true },
  { id: 'mock-17', name: 'Bohnengold', lat: 52.4874, lng: 13.4295, types: ['bar', 'pub'], address: 'Sanderstr. 7', openingHours: 'Mo-Su 09:00-02:00', smoking: 'yes' },
  { id: 'mock-18', name: 'Tier', lat: 52.4997, lng: 13.4285, types: ['bar', 'nightclub'], address: 'Weserstr. 42', openingHours: 'We-Sa 21:00-06:00' },
  { id: 'mock-19', name: 'Ankerklause', lat: 52.4945, lng: 13.4210, types: ['bar', 'pub'], address: 'Kottbusser Damm 104', openingHours: 'Mo-Su 16:00-04:00', outdoorSeating: true },
  { id: 'mock-20', name: 'Süss War Gestern', lat: 52.5160, lng: 13.4541, types: ['cocktail', 'bar'], address: 'Wühlischstr. 43', openingHours: 'Tu-Sa 19:00-03:00' },
];

export class MockProvider implements BarDataProvider {
  async nearbyBars(params: NearbyParams): Promise<Bar[]> {
    const { lat, lng, radiusM, types } = params;

    let bars: Bar[] = MOCK_BARS.map((bar) => ({
      ...bar,
      distance: distanceMeters(lat, lng, bar.lat, bar.lng),
    }));

    // Filter by radius
    bars = bars.filter((b) => (b.distance ?? 0) <= radiusM);

    // Filter by type
    if (types && types.length > 0) {
      bars = bars.filter((bar) =>
        types.some((t) => bar.types.includes(t))
      );
    }

    // Sort by distance
    bars.sort((a, b) => (a.distance ?? 0) - (b.distance ?? 0));

    return bars;
  }

  async barDetails(id: string): Promise<BarDetails> {
    const bar = MOCK_BARS.find((b) => b.id === id);
    if (!bar) throw new Error(`Mock bar not found: ${id}`);

    return {
      ...bar,
      distance: undefined,
      mapsUrl: `https://www.google.com/maps/dir/?api=1&destination=${bar.lat},${bar.lng}`,
      vicinity: bar.address,
      fullOpeningHours: bar.openingHours ? [bar.openingHours] : undefined,
    };
  }
}
