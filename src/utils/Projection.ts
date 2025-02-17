const ratio = Math.PI / (180 * 3600);
const sec2rad = (seconds) => seconds * ratio;
const rad2sec = (radians) => radians / ratio;

export default class Projection {
  // Earth radius expressed in Nm
  static earthRadius = 3437.746770785;

  /**
   * Default constructor creates a projection centered on Paris
   */
  constructor(center = [48.8667 * 3600, 2.3167 * 3600]) {
    // Paris
    this.setCenter(center);
  }

  setCenter(center) {
    this.latitudeRadians = sec2rad(center[0]);
    this.sinusLatitude = Math.sin(this.latitudeRadians);
    this.cosinusLatitude = Math.cos(this.latitudeRadians);
    this.longitudeRadians = sec2rad(center[1]);
  }

  getCenter() {
    return [rad2sec(this.latitudeRadians), rad2sec(this.longitudeRadians)];
  }

  geo2stereo(point) {
    const latRad = sec2rad(point[0]);
    const lonRad = sec2rad(point[1]);
    const slat = Math.sin(latRad);
    const clat = Math.cos(latRad);
    const cdlon = Math.cos(lonRad - this.longitudeRadians);
    const ratio =
      (2.0 * Projection.earthRadius) /
      (1.0 + slat * this.sinusLatitude + clat * this.cosinusLatitude * cdlon);
    const x = ratio * clat * Math.sin(lonRad - this.longitudeRadians);
    const y =
      -ratio *
      (this.cosinusLatitude * slat - clat * this.sinusLatitude * cdlon);
    return [x, y];
  }

  stereo2geo(feet) {
    const x = feet[0];
    const y = feet[1];

    const l_lat =
      (-y * Projection.earthRadius * this.cosinusLatitude +
        2 *
          Projection.earthRadius *
          Projection.earthRadius *
          this.sinusLatitude) /
      (x * x + y * y + 4 * Projection.earthRadius * Projection.earthRadius);
    const latitudeRadians = Math.asin(4.0 * l_lat - this.sinusLatitude);
    const slat = Math.sin(latitudeRadians);
    const longitudeRadians =
      this.longitudeRadians +
      Math.atan(
        (x * (slat + this.sinusLatitude)) /
          (slat *
            (2 * Projection.earthRadius * this.cosinusLatitude +
              y * this.sinusLatitude) +
            y)
      );

    // variante de calcul proposée par chatgpt
    // const rho = Math.sqrt(x * x + y * y); // Distance depuis le centre de la projection
    // const c = 2 * Math.atan(rho / (2 * Projection.earthRadius)); // Angle c

    // Calcul des coordonnées géographiques
    // const latitudeRadians = Math.asin(Math.cos(c) * this.sinusLatitude + (y * Math.sin(c) * this.cosinusLatitude) / rho );
    // const longitudeRadians = this.longitudeRadians + Math.atan2( x * Math.sin(c), rho * this.cosinusLatitude * Math.cos(c) - y * this.sinusLatitude * Math.sin(c) );

    return [rad2sec(latitudeRadians), rad2sec(longitudeRadians)];
  }

  formatLatLon(latLong) {
    const [latitude, longitude] = latLong;
    const formatCoord = (seconds, positiveDir, negativeDir) => {
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
