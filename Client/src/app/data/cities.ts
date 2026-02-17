import { HttpClient } from '@angular/common/http';

// API service לקבלת רשימה של יישובים בישראל מ-data.gov.il
export async function fetchIsraelCities(http: HttpClient): Promise<string[]> {
  try {
    const params = {
      resource_id: 'b7cf8f14-64a2-4b33-8d4b-edb286fdbd37',
      limit: '1500'
    };

    const response = await http
      .get<any>('https://data.gov.il/api/action/datastore_search', { params })
      .toPromise();

    if (response && response.result && response.result.records) {
      const cities: string[] = response.result.records
        .map((record: any) => record['שם_ישוב'])
        .filter((city: string) => city && city.trim() && city.trim() !== 'לא רשום' && !city.includes('('))
        .map((city: string) => city.trim())
        .sort();
      
      return Array.from(new Set(cities)) as string[];
    }
  } catch (error) {
    console.error('Error fetching cities from API:', error);
  }

  return [];
}
