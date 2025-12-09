export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const API_BASE_URL = process.env.VITE_API_BASE_URL || 
                         process.env.API_BASE_URL ||
      'https://respond-io-fe-bucket.s3.ap-southeast-1.amazonaws.com'
    const API_PAYLOAD_PATH = process.env.VITE_API_PAYLOAD_PATH || 
                             process.env.API_PAYLOAD_PATH ||
      '/candidate-assessments/payload.json'
    
    const payloadUrl = `${API_BASE_URL}${API_PAYLOAD_PATH}`

    const response = await fetch(payloadUrl, {
      headers: {
        'Accept': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to fetch payload: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300')

    return res.status(200).json(data)
  } catch (error) {
    console.error('Error fetching payload:', error)
    return res.status(500).json({ 
      error: 'Failed to fetch payload',
      message: error.message 
    })
  }
}

