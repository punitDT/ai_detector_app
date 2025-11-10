// Configuration file for API endpoints
// Vite exposes environment variables prefixed with VITE_ to the client
export const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:8000'

console.log('API Base URL:', BASE_URL)
