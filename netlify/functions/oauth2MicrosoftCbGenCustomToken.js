const buildRes = require('../utils/buildRes'),
      { callTokenEndpoint, callGraphMeEndpoint } = require('../utils/microsoftEndpoints'),
      createFirebaseAdmin = require('../utils/createFirebaseAdmin')


// Netlify function handler
exports.handler = async ( event, context ) => {
  if (event.httpMethod === 'OPTIONS')
    return buildRes({})

  if (event.httpMethod !== 'POST')
    return buildRes({ statusCode: 405, data: 'Wrong method!' })

  let reqBody
  try { reqBody = JSON.parse(event.body) } catch (error) {
    return buildRes({ error: 'Please provide body' })
  }

  if (!reqBody.redirectUri || !reqBody.code)
    return buildRes({ statusCode: 400, error: 'Please provide required params "redirectUri" and "code".' })

  let firebaseAdmin
  try {
    firebaseAdmin = createFirebaseAdmin()

    // First get Token from microsoft.com API.
    const tokenRes = await callTokenEndpoint({ code: reqBody.code, redirectUri: reqBody.redirectUri })

    // Then, get email address from microsoft.com /me API.
    const graphMeRes = await callGraphMeEndpoint({ accessToken: tokenRes.access_token })
    if (!graphMeRes.mail || !graphMeRes.mail.length)
      throw new Error('No "email" field in the Graph API Response.')

  
    // Then, get/create the user from firebase.
    let user
    try {
      user = await firebaseAdmin.auth().getUserByEmail(graphMeRes.mail)
    } catch (error) {
      /** @TODO Get Photo from Microsoft API & create user with it. */

      user = await firebaseAdmin.auth().createUser({
        email: graphMeRes.mail,
        displayName: graphMeRes.displayName || null
      })
    }

    // finally, create the customToken and return it
    const token = await firebaseAdmin.auth().createCustomToken(user.uid)
    if (!token)
      throw new Error('Failed to create customToken')

    return buildRes({ data: {
      firebaseCustomToken: token,
      providerTokenData: tokenRes
    } })

  } catch (error) {
    console.error(error)
    return buildRes({ statusCode: 500, error: error.message })
    
  } finally {
    // IMPORTANT: Delete app before returning callback 
    // (due to netlify bug: https://community.netlify.com/t/netlify-function-timeout-after-10-seconds-when-published/18220/5)
    firebaseAdmin.app().delete()
  }
}