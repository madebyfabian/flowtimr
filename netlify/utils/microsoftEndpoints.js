const axios = require('axios')

const { MS_OAUTH2_CLIENT_ID, MS_OAUTH2_CLIENT_SECRET } = process.env
const GRAPH_BASE_URL = 'https://graph.microsoft.com/v1.0'


/**
 * Verifies a code that was responded after a microsoft login redirect and returns accessToken + refreshToken.
 */
const callTokenEndpoint = async ({ code = null, redirectUri = null, refreshToken = null }) => {
	const url = 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
				body = new URLSearchParams({
					client_id: MS_OAUTH2_CLIENT_ID,
					client_secret: MS_OAUTH2_CLIENT_SECRET,
				})

	body.append('grant_type', code ? 'authorization_code' : 'refresh_token')

	if (code) {
		body.append('code', code)
		body.append('redirect_uri', redirectUri)
		body.append('scope', 'profile email calendars.read user.read openid offline_access')
	}

	if (refreshToken) {
		body.append('refresh_token', refreshToken)
	}

	const resObj = await axios.post(url, body)
	if (resObj.status > 200) 
		throw new Error(JSON.stringify(resObj.data))

	return resObj.data
}


/**
 * Takes a refreshToken and returns a new accessToken.
 */
const callRefreshTokenEndpoint = async ({ refreshToken }) => {
	return callTokenEndpoint({ refreshToken })
}


const _buildGraphAPIHeaders = ({ accessToken }) => (
	{ 'Authorization': `Bearer ${ accessToken }` }
)


/**
 * Calls MS Graph API /me to get the user data (email, ...)
 */
const callGraphMeEndpoint = async ({ accessToken }) => {
	const headers = _buildGraphAPIHeaders({ accessToken })

	return (await axios.get(GRAPH_BASE_URL + '/me', { headers })).data
}


/**
 * Calls MS Graph API /me/photo to get user photo data
 */
const callGraphMePhotoEndpoint = async ({ accessToken }) => {
	const headers = _buildGraphAPIHeaders({ accessToken })

	return (await axios.get(GRAPH_BASE_URL + '/me/photo', { headers })).data
}


module.exports = {
	callTokenEndpoint,
	callRefreshTokenEndpoint,
	callGraphMeEndpoint,
	callGraphMePhotoEndpoint
}