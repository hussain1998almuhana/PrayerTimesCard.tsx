// Coordinates for Kaaba in Mecca
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

export interface Position {
  lat: number;
  lng: number;
}

export const getCurrentPosition = (): Promise<Position> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  });
};

export const calculateQibla = (lat: number, lng: number): number => {
  // Convert degrees to radians
  const toRad = (degrees: number) => degrees * (Math.PI / 180);
  const toDeg = (radians: number) => radians * (180 / Math.PI);

  const lat1 = toRad(lat);
  const lng1 = toRad(lng);
  const lat2 = toRad(KAABA_LAT);
  const lng2 = toRad(KAABA_LNG);

  const dLng = lng2 - lng1;

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  let bearing = toDeg(Math.atan2(y, x));
  bearing = (bearing + 360) % 360;

  return bearing;
};

export const calculateMagneticDeclination = (lat: number, lng: number): number => {
  // Simplified magnetic declination calculation
  // For more accurate results, use a web service or a more complex model
  // This is a rough approximation based on the World Magnetic Model
  
  // Convert to radians
  const latRad = lat * (Math.PI / 180);
  const lngRad = lng * (Math.PI / 180);
  
  // Simplified dipole model (very basic approximation)
  // Real WMM calculations are much more complex
  const declination = Math.sin(lngRad) * Math.cos(latRad) * 10;
  
  return declination;
};
