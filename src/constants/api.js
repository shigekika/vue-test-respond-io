export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  'https://respond-io-fe-bucket.s3.ap-southeast-1.amazonaws.com'
export const API_PAYLOAD_PATH = import.meta.env.VITE_API_PAYLOAD_PATH || 
  '/candidate-assessments/payload.json'
export const API_PAYLOAD_URL = `${API_BASE_URL}${API_PAYLOAD_PATH}`
export const API_PROXY_PATH = '/api/payload'

