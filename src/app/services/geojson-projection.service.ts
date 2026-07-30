import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeojsonProjectionService {
  private readonly viewportWidth = 1010;
  private readonly viewportHeight = 666;

  constructor() {}

  /**
   * Convert Longitude (-180 to 180) and Latitude (-90 to 90) into 1010x666 SVG coordinates
   */
  projectCoord(lng: number, lat: number): [number, number] {
    // Equirectangular Projection aligned with SVG viewport
    const x = ((lng + 180) / 360) * this.viewportWidth;
    const y = ((90 - lat) / 180) * this.viewportHeight;
    return [Math.round(x * 100) / 100, Math.round(y * 100) / 100];
  }

  /**
   * Convert single GeoJSON Polygon coordinate rings into SVG path string d="M x y L x y ... Z"
   */
  polygonToSvgPath(coordinates: number[][][]): string {
    if (!coordinates || coordinates.length === 0) return '';

    return coordinates
      .map(ring => {
        if (!ring || ring.length === 0) return '';
        const points = ring.map(coord => {
          const [px, py] = this.projectCoord(coord[0], coord[1]);
          return `${px},${py}`;
        });
        return `M ${points.join(' L ')} Z`;
      })
      .filter(path => path.length > 0)
      .join(' ');
  }

  /**
   * Convert GeoJSON MultiPolygon coordinate rings into SVG path string
   */
  multiPolygonToSvgPath(coordinates: number[][][][]): string {
    if (!coordinates || coordinates.length === 0) return '';

    return coordinates
      .map(polygon => this.polygonToSvgPath(polygon))
      .filter(path => path.length > 0)
      .join(' ');
  }

  /**
   * Convert GeoJSON Geometry (Polygon or MultiPolygon) into SVG path string d="..."
   */
  geometryToSvgPath(geometry: { type: string; coordinates: any }): string {
    if (!geometry || !geometry.coordinates) return '';

    if (geometry.type === 'Polygon') {
      return this.polygonToSvgPath(geometry.coordinates);
    } else if (geometry.type === 'MultiPolygon') {
      return this.multiPolygonToSvgPath(geometry.coordinates);
    }
    return '';
  }

  /**
   * Calculate bounding center [cx, cy] for labels and markers
   */
  calculateCentroid(geometry: { type: string; coordinates: any }): { cx: number; cy: number } {
    let sumX = 0;
    let sumY = 0;
    let count = 0;

    const processRing = (ring: number[][]) => {
      ring.forEach(coord => {
        const [px, py] = this.projectCoord(coord[0], coord[1]);
        sumX += px;
        sumY += py;
        count++;
      });
    };

    if (geometry.type === 'Polygon' && geometry.coordinates) {
      geometry.coordinates.forEach(processRing);
    } else if (geometry.type === 'MultiPolygon' && geometry.coordinates) {
      geometry.coordinates.forEach((poly: any) => poly.forEach(processRing));
    }

    if (count === 0) return { cx: 505, cy: 333 };
    return { cx: Math.round(sumX / count), cy: Math.round(sumY / count) };
  }
}
