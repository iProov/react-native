import RNFetchBlob from 'rn-fetch-blob'

// THIS CODE IS PROVIDED FOR DEMO PURPOSES ONLY AND SHOULD NOT BE USED IN
// PRODUCTION! YOU SHOULD NEVER EMBED YOUR CREDENTIALS IN A PUBLIC APP RELEASE!
// THESE API CALLS SHOULD ONLY EVER BE MADE FROM YOUR BACK-END SERVER

export const CLAIM_TYPE_ENROL = 'enrol'
export const CLAIM_TYPE_VERIFY = 'verify'
export const ASSURANCE_TYPE_GENUINE_PRESENCE = 'genuine_presence'
export const ASSURANCE_TYPE_LIVENESS = 'liveness'
export const PHOTO_SOURCE_OPTICAL_ID = 'oid'
export const PHOTO_SOURCE_ELECTRONIC_ID = 'eid'

export default class ApiClient {
  constructor(config) {
    this.baseUrl = config.baseUrl.endsWith('/')
      ? config.baseUrl
      : config.baseUrl + '/'
    this.apiKey = config.apiKey
    this.secret = config.secret
  }

  async getToken(assuranceType, claimType, userId) {
    return await fetch(`${this.baseUrl}claim/${claimType}/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: this.apiKey,
        secret: this.secret,
        resource: 'com.iproov.sdk',
        user_id: userId,
        client: 'android',
        assurance_type: assuranceType
      })
    })
  }

  async enrolPhoto(token, image, photoSource) {
    const form = [
      { name: 'api_key', data: this.apiKey },
      { name: 'secret', data: this.secret },
      { name: 'rotation', data: '0' },
      { name: 'token', data: token },
      { name: 'source', data: photoSource },
      { name: 'image', filename: 'image.jpeg', type: 'image/jpeg', data: image }
    ]

    return await RNFetchBlob.fetch(
      'POST',
      `${this.baseUrl}/claim/enrol/image`,
      {
        'Content-Type':
          'multipart/form-data; boundary=-------kjqdgfljhsgdfljhgsdlfjhgasdf'
      },
      form
    )
  }

  async enrolPhotoAndGetVerifyToken(userId, assuranceType, image, photoSource) {
    const response = await this.getToken(assuranceType, CLAIM_TYPE_ENROL, userId)

    if (!response.ok) return response

    const body = await response.json()

    await this.enrolPhoto(body.token, image, photoSource)

    return this.getToken(assuranceType, CLAIM_TYPE_ENROL, userId)
  }

  async validate(token, userId) {
    return await fetch(`${this.baseUrl}claim/verify/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        api_key: this.apiKey,
        secret: this.secret,
        user_id: userId,
        token: token,
        assurance_type: assuranceType,
        ip: '127.0.0.1',
        client: 'android'
      })
    })
  }

  async invalidate(token, reason) {
    return await fetch(`${this.baseUrl}claim/${token}/invalidate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reason: reason
      })
    })
  }
}
