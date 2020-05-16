// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'iuw5xrx2mc'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'alew-dev.eu.auth0.com', // Auth0 domain
  clientId: 'yK1fFhNsmWbVPml5uPglcbaHuBJu85fE', // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
