import { v4 as uuidv4 } from 'uuid'
import storage, { STORAGE_KEYS } from '@/services/storage'
import router from '@/router'
import { store } from '@/store'
import firebase from '@/services/firebase'


const _graphUrl = 'https://graph.microsoft.com/v1.0',
      _oAuthUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0'

const _getOAuthCallbackUrl = () => {
  const routeData = router.resolve({ name: 'AuthCallback', params: { provider: 'microsoft' } })
  return location.origin + routeData.href
}


export default class Graph {

  // --- Auth Stuff ---

  /**
   * Returns an accessToken. Refreshes silently, if it's invalid.
   */
  async getToken() {
    let tokenData = storage.get(STORAGE_KEYS.auth.tokenProviderData.microsoft)
    if (!tokenData || !tokenData.refreshToken || !tokenData.accessToken)
      return router.push({ name: 'AuthView', query: { error: true }})

    const expiresAt = tokenData.expiresAt || 0

    // If it's invailid, do refresh the token.
    if (+(new Date()) >= expiresAt) 
      tokenData = await this._doRefreshToken({ refreshToken: tokenData.refreshToken })
    
    return tokenData.accessToken
  }


  /**
   * Force the tokenData in storage to update (e.g. on login)
   * @param {object} rawApiTokenDataResponse The direct token json response from API 
   *   (e.g. { "access_token": "...", "refresh_token": "...", "expires_in": 3600 })
   */
  updateTokenData( rawApiTokenDataResponse ) {
    const currDate = +(new Date()) / 1000
    const expiresAt = (currDate + rawApiTokenDataResponse.expires_in) * 1000

    return storage.setAndGet(STORAGE_KEYS.auth.tokenProviderData.microsoft, { 
      refreshToken: rawApiTokenDataResponse.refresh_token, 
      accessToken: rawApiTokenDataResponse.access_token, 
      expiresAt
    })
  }


  /**
   * Get's called as Oauth callback by router
   */
  async handleAuthCallback( to, from ) {
    try {
      if (to.query?.state !== storage.getAndDelete(STORAGE_KEYS.auth.customIdentifier)) 
        throw new Error('Error, the to.query.state and the state saved in storage are not equal!')
      
      const code = to.query?.code
      if (!code) 
        throw new Error('There is no to.query.code present.')
  
      // Now we have the code, we can validate it on our firebase-function and return a customToken if valid.
      const url = process.env.VUE_APP_NETLIFY_FUNCTIONS_BASE_URL + '/oauth2MicrosoftCbGenCustomToken',
            body = JSON.stringify({ code, redirectUri: _getOAuthCallbackUrl() })
  
      const res = await fetch(url, { method: 'POST', body, headers: { 'Content-Type': 'application/json' } })
      const { data, error } = await res.json()
      if (error)
        throw new Error(JSON.stringify(error))
  
      // Update tokenData in storage
      store.APIService.updateTokenData(data['providerTokenData'])
  
      // Sign in user
      await firebase.auth().signInWithCustomToken(data.firebaseCustomToken)
      
    } catch (error) {
      console.error(error)
      return { name: 'AuthView', query: { error: error.message } }
    }
  }


  async _doRefreshToken({ refreshToken }) {
    try {
      console.log('call _doRefreshToken()')
      const url = process.env.VUE_APP_NETLIFY_FUNCTIONS_BASE_URL + '/oauth2MicrosoftRefreshAccessToken'
      const res = await fetch(url, { 
        method: 'POST', 
        body: JSON.stringify({ refreshToken }), 
        headers: { 'Content-Type': 'application/json' } 
      })
      const { data, error } = await res.json()
      if (error)
        throw new Error(JSON.stringify(error))

      // Update in storage & return 
      return this.updateTokenData(data['providerTokenData'])

    } catch (error) {
      console.error(error)
      return null
    }
  }


  login() {
    // Generate random identifier we need later in the callback to identify the call.
    const customIdentifier = uuidv4()
    storage.set(STORAGE_KEYS.auth.customIdentifier, customIdentifier)

    // Build URL/Params
    const params = new URLSearchParams({
      client_id: process.env.VUE_APP_GRAPH_CLIENT_ID,
      response_type: 'code',
      redirect_uri: _getOAuthCallbackUrl(),
      scope: 'profile email calendars.read calendars.read.shared user.read openid offline_access',
      state: customIdentifier
    })

    // Finally redirect to auth provider
    location.replace(_oAuthUrl + '/authorize?' + params.toString())
  }


  // --- API Stuff ---

  async _httpRequest( path, options = {} ) {
    const accessToken = await this.getToken(),
          headers = new Headers({ Authorization: `Bearer ${accessToken}` }),
          url = _graphUrl + path

    const res = await fetch(url, { headers, ...options })
    if (!res.ok) {
      let errBody = await res.text()
      console.error(`Error while calling API endpoint. Response is:\n`, res, '\n\nBody is:\n', errBody)
      throw new Error(errBody)
    }

    return { 
      res, 
      data: res.headers.get('Content-Type').includes('application/json') 
        ? await res.json() 
        : await res.text() 
    }
  }


  /**
   * Gets an array of events from the MS Graph API.
   * @param {string} startTime e.g. 2019-11-08T19:00:00
   * @param {string} endTime e.g. 2019-11-08T19:00:00
   */
  async getEvents( startTime, endTime ) {
    const params = new URLSearchParams({ startDateTime: startTime, endDateTime: endTime })
    const url = '/me/calendar/calendarView?' + params.toString(),
          { data } = await this._httpRequest(url)

    return data.value
  }


  async postEventAnswer( id, action ) {
    if (!id)
      throw new Error('No id param given!')

    const actionEndpoints = {
      isAccepted: 'accept',
      isTentativelyAccepted: 'tentativelyAccept',
      isDeclined: 'decline',
      isCancelled: ''
    }

    const isCancelled = action === 'isCancelled'

    const endpoint = actionEndpoints[action]
    if (endpoint === undefined)
      throw new Error(`Given action param "${action}" is not a valid one. Valid ones are`, Object.keys(actionEndpoints))

    const url = `/me/events/${id}/${endpoint}`,
          options = { method: isCancelled ? 'DELETE' : 'POST' }

    const { res, data} = await this._httpRequest(url, options)
    if (res.status !== (isCancelled ? 204 : 202))
      throw new Error(data)
  }


  /**
   * Makes a POST request to send a "Accept Event" email to the organizer.
   * @param {string} id The MS Graph Event id.
   */
  async acceptEvent( id ) {
    if (!id)
      throw new Error('No id param given!')

    const options = { method: 'POST' },
          url = `/me/events/${id}/accept`

    const { res, data } = await this._httpRequest(url, options)
    if (res.status !== 202)
      throw new Error()
  }
}