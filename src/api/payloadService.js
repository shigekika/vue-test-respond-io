import axios from 'axios'
import { API_PAYLOAD_URL, API_PROXY_PATH } from '../constants/api'

const API_URL = import.meta.env.DEV ? API_PROXY_PATH : API_PAYLOAD_URL

export const payloadService = {
  async fetchPayload() {
    try {
      const response = await axios.get(API_URL, {
        headers: {
          'Accept': 'application/json',
        }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching payload:', error)
      return []
    }
  },

  async updatePayload(data) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(data)
      }, 300)
    })
  },
}

