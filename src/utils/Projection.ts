const ratio = Math.PI / (180 * 3600);
const sec2rad = (seconds: number): number => seconds * ratio;
const rad2sec = (radians: number): number => radians / ratio;

export const translate = ([latsec, longsec]: [number, number], dist: number, track: number): [number, number] => {
  const lat = sec2rad(latsec);
  const d = Math.sin(sec2rad(dist * 60)); // 1Nm = 1 minute of angle
  const t = sec2rad(track * 3600);
  latsec += rad2sec(Math.asin(Math.cos(t) * d));
  longsec += rad2sec(Math.asin((Math.sin(t) * d) / Math.cos(lat)));
  return [latsec, longsec];
};

export const centerAndArea = (points: [number, number][]): [[number, number], number] => {
  const n = points.length;
  let cx = 0,
    cy = 0,
    area = 0;
  for (let i = 0; i < n; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[(i + 1) % n];
    const factor = x1 * y2 - x2 * y1;
    cx += (x1 + x2) * factor;
    cy += (y1 + y2) * factor;
    area += factor;
  }

  area *= 0.5;
  cx /= 6 * area;
  cy /= 6 * area;

  return [[cx, cy], area];
};

export default class Projection {
  // Earth radius expressed in Nm
  static earthRadius = 3437.746770785;

  private latitudeRadians!: number;
  private sinusLatitude!: number;
  private cosinusLatitude!: number;
  private longitudeRadians!: number;

  /**
   * Default constructor creates a projection centered on Paris
   */
  constructor(center: [number, number] = [48.8667 * 3600, 2.3167 * 3600]) {
    // Paris
    this.setCenter(center);
  }

  setCenter(center: [number, number]): void {
    this.latitudeRadians = sec2rad(center[0]);
    this.sinusLatitude = Math.sin(this.latitudeRadians);
    this.cosinusLatitude = Math.cos(this.latitudeRadians);
    this.longitudeRadians = sec2rad(center[1]);
  }

  getCenter() {
    return [rad2sec(this.latitudeRadians), rad2sec(this.longitudeRadians)];
  }

  geo2stereo(point: [number, number]): [number, number] {
    const latRad = sec2rad(point[0]);
    const lonRad = sec2rad(point[1]);
    const slat = Math.sin(latRad);
    const clat = Math.cos(latRad);
    const cdlon = Math.cos(lonRad - this.longitudeRadians);
    const ratio =
      (2.0 * Projection.earthRadius) / (1.0 + slat * this.sinusLatitude + clat * this.cosinusLatitude * cdlon);
    const x = ratio * clat * Math.sin(lonRad - this.longitudeRadians);
    const y = -ratio * (this.cosinusLatitude * slat - clat * this.sinusLatitude * cdlon);
    return [x, y];
  }

  stereo2geo(feet: [number, number]): [number, number] {
    const x = feet[0];
    const y = feet[1];

    const l_lat =
      (-y * Projection.earthRadius * this.cosinusLatitude +
        2 * Projection.earthRadius * Projection.earthRadius * this.sinusLatitude) /
      (x * x + y * y + 4 * Projection.earthRadius * Projection.earthRadius);
    const latitudeRadians = Math.asin(4.0 * l_lat - this.sinusLatitude);
    const slat = Math.sin(latitudeRadians);
    const longitudeRadians =
      this.longitudeRadians +
      Math.atan(
        (x * (slat + this.sinusLatitude)) /
          (slat * (2 * Projection.earthRadius * this.cosinusLatitude + y * this.sinusLatitude) + y)
      );

    // variante de calcul proposée par chatgpt
    // const rho = Math.sqrt(x * x + y * y); // Distance depuis le centre de la projection
    // const c = 2 * Math.atan(rho / (2 * Projection.earthRadius)); // Angle c

    // Calcul des coordonnées géographiques
    // const latitudeRadians = Math.asin(Math.cos(c) * this.sinusLatitude + (y * Math.sin(c) * this.cosinusLatitude) / rho );
    // const longitudeRadians = this.longitudeRadians + Math.atan2( x * Math.sin(c), rho * this.cosinusLatitude * Math.cos(c) - y * this.sinusLatitude * Math.sin(c) );

    return [rad2sec(latitudeRadians), rad2sec(longitudeRadians)];
  }

  formatLatLon(latLong: [number, number]): string {
    const [latitude, longitude] = latLong;
    const formatCoord = (seconds: number, positiveDir: string, negativeDir: string) => {
      const direction = seconds >= 0 ? positiveDir : negativeDir;
      const absSeconds = Math.abs(seconds);
      const degrees = Math.floor(absSeconds / 3600);
      const minutes = Math.floor((absSeconds % 3600) / 60)
        .toString()
        .padStart(2, "0");
      const secs = Math.round(absSeconds % 60)
        .toString()
        .padStart(2, "0");
      return `${direction}${degrees}°${minutes}'${secs}"`;
    };

    const latText = formatCoord(latitude, "N", "S");
    const lonText = formatCoord(longitude, "E", "W");

    return `${latText} ${lonText}`;
  }
}
