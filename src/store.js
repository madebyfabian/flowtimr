import Vue from 'vue'
import APIService from '@/services/APIService'


export const store = Vue.observable({
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
    events = events.map(event => ({ 
      ...event, 
      subject: event.subject.trim().replace(/(?=\S)(\&|\/|\@)(?=\S)/g, '$&<wbr>'), // add hidden word breaks for "foo/bar", "foo&bar" or "foo@bar"
      start: { ...event.start, _unixDateTime: this.$date(event.start.dateTime + 'Z').valueOf() },
      end: { ...event.end, _unixDateTime: this.$date(event.end.dateTime + 'Z').valueOf() }
    }))

    // Sort events by date.
    events = events.sort(( a, b ) => a.start._unixDateTime - b.start._unixDateTime)

    return store.events = events
  }
}