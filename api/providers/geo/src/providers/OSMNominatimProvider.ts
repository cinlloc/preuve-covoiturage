import axios from 'axios';
import { URLSearchParams } from 'url';
import { NotFoundException, provider } from '@ilos/common';

import { GeoCoderInterface, PointInterface } from '../interfaces';

@provider()
export class OSMNominatimProvider implements GeoCoderInterface {
  private domain = 'https://nominatim.openstreetmap.org/';

  async literalToPosition(literal: string): Promise<PointInterface> {
    const params = new URLSearchParams({
      q: literal,
      format: 'json',
      'accept-language': 'fr-fr',
      limit: '1',
    });

    let { data } = await axios.get(`${this.domain}/search.php`, { params });

    if (data.error || (Array.isArray(data) && data.length === 0)) {
      throw new NotFoundException(`Not found on Nominatim (${literal}). ${data.error}`);
    }

    if (Array.isArray(data)) {
      data = data.shift();
    }

    const { lat, lon } = data;
    if (!lon || !lat) {
      throw new NotFoundException(`Literal not found on Nominatim (${literal})`);
    }

    return {
      lon: Number(lon),
      lat: Number(lat),
    };
  }
}
