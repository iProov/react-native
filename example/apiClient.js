import RNFetchBlob from 'rn-fetch-blob'

export class ApiClient {

  constructor(config) {
    this.baseUrl = config.baseUrl
    this.apiKey = config.apiKey
    this.secret = config.secret
  }

  async getToken(assuranceType, claimType, userId) {

    const response = await fetch(this.baseUrl + 'claim/' + claimType + '/token', {
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
    });
  
    return response.json();
  }

   async enrolPhoto(token, image, photoSource) {

    let form = [
      {name: 'api_key', data: this.apiKey},
      {name: 'secret', data: this.secret },
      {name: 'rotation', data: '0' },
      {name: 'token', data: token },
      { name: 'source', data: 'oid'},
      { name: 'image', filename: 'image.jpeg', type: 'image/jpeg', data: image } 
    ]

    const response = await RNFetchBlob.fetch('POST', `${this.baseUrl}claim/enrol/image`, {'Content-Type': 'multipart/form-data; boundary=-------kjqdgfljhsgdfljhgsdlfjhgasdf'}, form)

    return response.json()
  }

  async validate(token, userId) {

    const response = await fetch(this.baseUrl + 'claim/verify/validate', {
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
    });
  
    return response.json();
  }

  async invalidate(token, reason) {

    const response = await fetch(this.baseUrl + 'claim/${token}/invalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        reason: reason
      })
    });
  
    return response.json();
  }
  
}