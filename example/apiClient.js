
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

}