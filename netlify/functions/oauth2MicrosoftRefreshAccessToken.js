const buildRes = require('../utils/buildRes'),
      { callRefreshTokenEndpoint } = require('../utils/microsoftEndpoints')


// Netlify function handler
exports.handler = async ( event, context ) => {
  switch (event.httpMethod) {
    case 'POST': {
      let reqBody
      try { reqBody = JSON.parse(event.body) } catch (error) {
        return buildRes({ error: 'Please provide body' })
      }

      if (!reqBody.refreshToken)
        return buildRes({ statusCode: 400, error: 'Please provide required param "refreshToken".' })

      try {
        const refreshTokenRes = await callRefreshTokenEndpoint({ refreshToken: reqBody.refreshToken })
				return buildRes({ data: { providerTokenData: refreshTokenRes } })
    
      } catch (error) {
        return buildRes({ statusCode: 500, error: error.message })
      }
    }

    case 'OPTIONS': 
      return buildRes({})
  
    default:
      return buildRes({ statusCode: 405, data: 'Wrong method!' })
  }
}