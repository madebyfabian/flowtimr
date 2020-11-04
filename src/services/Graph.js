import * as Msal from 'msal'


export default class Graph {
  constructor() {
    this.graphUrl = 'https://graph.microsoft.com/v1.0/'
    this.userRequest = { scopes: [ 'user.read', 'Calendars.ReadWrite', 'Calendars.ReadWrite.Shared' ] }

    console.log(process.env.VUE_APP_GRAPH_CLIENT_ID)

    this.app = new Msal.UserAgentApplication({
      auth: { clientId: process.env.VUE_GRAPH_CLIENT_ID },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: false
      }
    })
  }


 
  // Auth Stuff

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



  // API Stuff

  /**
   * Get the Calendar Data
   * @param {*} startTime e.g. 2019-11-08T19:00:00-08:00
   * @param {*} endTime e.g. 2019-11-08T19:00:00-08:00
   */
  async getCalendarData( startTime, endTime ) {
    const accessToken = await this.getToken(),
          headers = new Headers({ Authorization: `Bearer ${accessToken}` }),
          url = this.graphUrl + `/me/calendar/calendarView?startDateTime=${startTime}&endDateTime=${endTime}`

    return fetch(url, { headers })
      .then(response => response.json())
      .catch(response => {
        throw new Error(response.text())
      })
  }
}