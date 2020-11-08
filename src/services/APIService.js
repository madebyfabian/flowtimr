import { UserAgentApplication } from 'msal'


export default class Graph {
  constructor() {
    this.graphUrl = 'https://graph.microsoft.com/v1.0'
    this.userRequest = { scopes: [ 'user.read', 'Calendars.ReadWrite', 'Calendars.ReadWrite.Shared' ] }

    this.app = new UserAgentApplication({
      auth: { clientId: process.env.VUE_APP_GRAPH_CLIENT_ID },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: false
      }
    })
  }

 
  // --- Auth Stuff ---

  isAuthenticated() {
    return !!this.app.getAccount()
  }

  async getToken() {
    if (!this.isAuthenticated()) 
      return null

    try {
      const { accessToken } = await this.app.acquireTokenSilent(this.userRequest)
      return accessToken
    } catch (err) {
      if (err.name !== 'InteractionRequiredAuthError')
        throw new Error(err)

      const { accessToken } = await this.app.acquireTokenRedirect(this.userRequest)
      return accessToken
    }
  }

  async login() {
    try {
      return this.app.loginRedirect(this.userRequest)
    } catch (error) {
      console.error(error)
    }
  }


  // --- API Stuff ---

  async _httpRequest( path, options = {} ) {
    const accessToken = await this.getToken(),
          headers = new Headers({ Authorization: `Bearer ${accessToken}` }),
          url = this.graphUrl + path

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