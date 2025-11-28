// API Configuration

// Base URL for API calls - use environment variable or fallback to /api (proxied by Nginx in Docker)
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

// Timeout settings (in milliseconds)
export const API_TIMEOUT = 30000;

// Common headers
export const API_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
}; 