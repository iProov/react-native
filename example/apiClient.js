
const baseUrl = 'https://beta.rp.secure.iproov.me/api/v2/';
const apiKey = '342a9ecc7a38610ab08620110c6250812d2a6c1d';
const secret = 'cefd2abf7aa3be084e1e8892fbdd262eb1553d03';

export async function getToken(assuranceType, claimType, userId) {

  const response = await fetch(baseUrl + 'claim/' + claimType + '/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      api_key: apiKey,
      secret: secret,
      resource: 'com.iproov.sdk',
      user_id: userId,
      client: 'android',
      assurance_type: assuranceType
    })
  });

  return response.json();
}
