// src/server.ts
import { Platform } from 'react-native';

// Define different server URLs for different environments with fallback support
const PRODUCTION_HTTPS_URL = 'https://165.22.208.62:8443/'; // HTTPS version
const PRODUCTION_HTTP_URL = 'http://165.22.208.62:8080/';   // HTTP fallback
const LOCAL_DEVELOPMENT_URL = 'http://192.168.1.100:8080/'; // Replace with your local IP
const ANDROID_EMULATOR_URL = 'http://10.0.2.2:8080/';

// Function to check if HTTPS is available
const checkHttpsAvailability = async (httpsUrl) => {
  try {
    const response = await fetch(httpsUrl, {
      method: 'HEAD',
      timeout: 5000,
    });
    return response.ok;
  } catch (error) {
    console.log('HTTPS not available, falling back to HTTP');
    return false;
  }
};

// Function to get the appropriate server URL with fallback mechanism
const getServerUrl = async () => {
  // For production builds or when you want to use the live server
  if (__DEV__) {
    // Development mode
    if (Platform.OS === 'android') {
      // Try HTTPS first, fallback to HTTP
      const httpsAvailable = await checkHttpsAvailability(PRODUCTION_HTTPS_URL);
      if (httpsAvailable) {
        return PRODUCTION_HTTPS_URL;
      } else {
        console.log('Using HTTP fallback for Android development');
        return PRODUCTION_HTTP_URL; // Change this to LOCAL_DEVELOPMENT_URL if testing locally
      }
    } else {
      // For iOS simulator or other platforms
      return PRODUCTION_HTTP_URL; // Change this to LOCAL_DEVELOPMENT_URL if testing locally
    }
  } else {
    // Production mode - try HTTPS first, fallback to HTTP
    const httpsAvailable = await checkHttpsAvailability(PRODUCTION_HTTPS_URL);
    return httpsAvailable ? PRODUCTION_HTTPS_URL : PRODUCTION_HTTP_URL;
  }
};

// For immediate use, export the HTTP URL as default
// The async function can be used where needed
const serverUrl = PRODUCTION_HTTP_URL;

// Export both sync and async versions
export const getServerUrlAsync = getServerUrl;
export const HTTPS_URL = PRODUCTION_HTTPS_URL;
export const HTTP_URL = PRODUCTION_HTTP_URL;

console.log('Default server URL:', serverUrl);
console.log('HTTPS URL available:', HTTPS_URL);

export default serverUrl;
