import { Injectable } from '@angular/core';
import { SESHAT_EMPIRES_MAP, SeshatEmpireData, SeshatDimensionScore } from '../seshat-data';

export interface RadarAxisInfo {
  key: keyof SeshatDimensionScore;
  label: string;
  angleDeg: number;
  x: number;
  y: number;
  labelX: number;
  labelY: number;
}

export interface ComparisonEmpireRender {
  empire: SeshatEmpireData;
  polygonPoints: string;
  color: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeshatDatabankService {
  private readonly seshatDataMap = SESHAT_EMPIRES_MAP;

  constructor() {}

  /**
   * Get Seshat data for a specific empire ID
   */
  getEmpireSeshatData(empireId: string): SeshatEmpireData | null {
    return this.seshatDataMap[empireId] || null;
  }

  /**
   * Get all registered Seshat empires as array
   */
  getAllSeshatEmpires(): SeshatEmpireData[] {
    return Object.values(this.seshatDataMap);
  }

  /**
   * Get top N empires sorted by Social Complexity S-Score
   */
  getTopComplexEmpires(limit: number = 5): SeshatEmpireData[] {
    return this.getAllSeshatEmpires()
      .sort((a, b) => b.sScore - a.sScore)
      .slice(0, limit);
  }

  /**
   * Calculate 6 radar axes layout geometry for SVG rendering
   */
  getRadarAxisGeometry(centerX: number = 150, centerY: number = 150, radius: number = 110): RadarAxisInfo[] {
    const axes: { key: keyof SeshatDimensionScore; label: string }[] = [
      { key: 'polityScale', label: 'Polity Scale' },
      { key: 'governance', label: 'Governance' },
      { key: 'infrastructure', label: 'Infrastructure' },
      { key: 'informationSystems', label: 'Information' },
      { key: 'militaryTech', label: 'Military Tech' },
      { key: 'axialReligion', label: 'Axial Religion' }
    ];

    const totalAxes = axes.length;
    return axes.map((axis, index) => {
      // Angle starting from top (-90 deg or -PI/2)
      const angleRad = (index * 2 * Math.PI / totalAxes) - (Math.PI / 2);
      const angleDeg = (index * 360 / totalAxes) - 90;

      const x = centerX + radius * Math.cos(angleRad);
      const y = centerY + radius * Math.sin(angleRad);

      const labelRadius = radius + 22;
      const labelX = centerX + labelRadius * Math.cos(angleRad);
      const labelY = centerY + labelRadius * Math.sin(angleRad);

      return {
        key: axis.key,
        label: axis.label,
        angleDeg,
        x,
        y,
        labelX,
        labelY
      };
    });
  }

  /**
   * Compute dynamic SVG polygon points string for an empire's 6 dimensions
   */
  calculateRadarPolygonPoints(
    dimensions: SeshatDimensionScore,
    centerX: number = 150,
    centerY: number = 150,
    radius: number = 110
  ): string {
    const axes: (keyof SeshatDimensionScore)[] = [
      'polityScale',
      'governance',
      'infrastructure',
      'informationSystems',
      'militaryTech',
      'axialReligion'
    ];

    const totalAxes = axes.length;
    const points = axes.map((axisKey, index) => {
      const score = Math.max(0, Math.min(100, dimensions[axisKey] || 0));
      const normalizedRadius = (score / 100) * radius;

      const angleRad = (index * 2 * Math.PI / totalAxes) - (Math.PI / 2);
      const px = centerX + normalizedRadius * Math.cos(angleRad);
      const py = centerY + normalizedRadius * Math.sin(angleRad);

      return `${px.toFixed(1)},${py.toFixed(1)}`;
    });

    return points.join(' ');
  }

  /**
   * Prepare comparison render data for up to 3 empire IDs
   */
  getComparativeRenderData(
    empireIds: string[],
    colors: string[] = ['#f59e0b', '#3b82f6', '#10b981'],
    centerX: number = 150,
    centerY: number = 150,
    radius: number = 110
  ): ComparisonEmpireRender[] {
    return empireIds
      .map((id, index) => {
        const empData = this.getEmpireSeshatData(id);
        if (!empData) return null;

        const polygonPoints = this.calculateRadarPolygonPoints(
          empData.dimensions,
          centerX,
          centerY,
          radius
        );

        return {
          empire: empData,
          polygonPoints,
          color: colors[index % colors.length]
        };
      })
      .filter((item): item is ComparisonEmpireRender => item !== null);
  }
}
