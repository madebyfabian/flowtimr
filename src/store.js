import { reactive } from 'vue'
import APIService from '@/services/APIService'


export const store = reactive({
  APIService: new APIService(),
  events: null
})


export const mutations = {
  /**
   * Fetches all calendar events, adds custom formatted data and adds it to global store.
   */
  async fetchAndUpdateEvents() {
    // Get data from API.
    const startTime = this.$date().startOf('day').format(),
          endTime   = this.$date().endOf('day').format()

    let events = await store.APIService.getEvents(startTime, endTime)
    if (!events || events.length === 0)
      return store.events = []

    // Remove all-day-events & events already passed by.
    events = events.filter(event => {
      return /*!event.isAllDay && */!this.$date().isAfter(this.$date(event.end.dateTime + 'Z'))
    })

    // Add unix timestamps to "start" and "end" event dates.
    events = events.map(event => {
      let locationData = { _text: event.location.displayName || null, _redirectTo: null }
      if (locationData._text && locationData._text.length) {
        let url
        if (_startsWithHttpHttps.test(locationData._text) || _startsLikeDomain.test(locationData._text))
          url = _parseUrl(locationData._text)

        if (url) {
          locationData._text = url.host
          locationData._redirectTo = url.href
        }
      }

      return { 
        ...event,
        location: { ...event.location, ...locationData },
        start: { ...event.start, _unixDateTime: this.$date(event.start.dateTime + 'Z').valueOf() },
        end: { ...event.end, _unixDateTime: this.$date(event.end.dateTime + 'Z').valueOf() }
      }
    })

    // Sort events by date.
    events = events.sort(( a, b ) => a.start._unixDateTime - b.start._unixDateTime)

    // console.log(events)
    // debugger

    return store.events = events
  }
}


// Checks if string starts with either https:// or http://
const _startsWithHttpHttps = /^https?:\/\//i


// Check if string starts with something domain-like (e.g. example.com, 123.example.com, example.co.uk).
const _startsLikeDomain = /^(\S{1,}\.)/i


// Parse a string and return a URL interface object if string is a valid url, otherwise "null".
const _parseUrl = str => {
  // Add https
  str = _startsWithHttpHttps.test(str) ? str
    : (/^\/\//i.test(str) ? 'https:' : 'https://') + str // If url looks like "//domain.com", don't add slashes.

  try { return new URL(str) } 
  catch (_) { return null }
}