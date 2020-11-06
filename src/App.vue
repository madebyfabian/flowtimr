<template>
  <div id="app" v-focus-visible>
    <div class="home" v-if="msal.isAuthenticated()">
      <div v-if="events !== null">
        <div class="main" :class="{ listOpened }">
          <div class="hero" :class="{ hasEvent: currActiveEventData }">
            <div v-if="currActiveEventData">
              <Badge :type="`blue`">Jetzt</Badge>
              <h1>{{ currActiveEventData.subject }}</h1>
              <EventInfoBar :items="[ 
                currActiveEventData._custom.remainingDuration.trim(),
                currActiveEventData.location.displayName.trim() 
              ]" />
            </div>
          
            <h1 v-else>
              <span v-if="nextEventData">
                Flowtime.
              </span>
              <span v-else>
                Alles erledigt
                <br>für heute.
                <br><br>
                <span style="opacity: .5">🎉</span>
              </span>
            </h1>
          </div>

          <div v-if="events.length !== 0">
            <EventNextUp v-if="nextEventData" :event="nextEventData" />

            <div class="navbar">
              <ButtonIconOnly @click="listOpened = !listOpened" />
            </div>
          </div>
        </div>

        <div v-if="events.length !== 0" class="list">
          <h1>Was steht <br>noch an?</h1>
          <EventSingleCard :event="event" v-for="(event, key) of events" :key="key" />
        </div>
      </div>
    </div>

    <Signin v-else @signin-button-click="msal.login()" /> 
  </div>
</template>

<script>
  import '@/scss/main.scss'

  import GraphService from '@/services/Graph'
  import formatMinutes from '@/utils/formatMinutes'

  import Badge from '@/components/Badge'
  import ButtonIconOnly from '@/components/ButtonIconOnly'
  import EventInfoBar from '@/components/EventInfoBar'
  import EventSingleCard from '@/components/EventSingleCard'
  import EventNextUp from '@/components/EventNextUp'
  import Signin from '@/components/Signin'


  export default {
    name: 'Home',

    components: { Badge, ButtonIconOnly, EventInfoBar, EventSingleCard, EventNextUp, Signin },

    data: () => ({
      events: null,
      listOpened: false,
      currDate: null,
      msal: new GraphService()
    }),
    
    computed: {
      nextEventData() {
        let event = this.events.find(event => {
          return this.currDate.isBefore(this.$date(event.start._unixDateTime))
        })

        if (!event)
          return null

        let offsetMin = this.$date(event.start._unixDateTime).diff(this.$date(), 'minute'),
            isClose = offsetMin <= 15

        let offsetStr = 'In '
        if (this.currActiveEventData) {
          let currAndNextEventOffsetMin = this.$date(this.currActiveEventData.end._unixDateTime).diff(event.start._unixDateTime, 'minute') 
          if (currAndNextEventOffsetMin <= 15)
            offsetStr = 'Danach – in '
          else if (currAndNextEventOffsetMin <= 5)
            offsetStr = 'Direkt danach – in '

          isClose = isClose && !this.currActiveEventData
        }

        return { ...event, _custom: {
          isClose,
          offsetStr: offsetStr + this.formatMinutes(offsetMin),
          startTimeStr: this.$date(event.start._unixDateTime).format('HH:mm'),
          durationStr: this.formatMinutes(this.$date(event.end._unixDateTime).diff(event.start._unixDateTime, 'minute'), 'short')
        }}
      },

      currActiveEventData() {
        let event = this.events.find(event => {
          return this.currDate.isAfter(this.$date(event.start._unixDateTime)) &&
                 this.currDate.isBefore(this.$date(event.end._unixDateTime))
        })

        if (!event)
          return null

        return { ...event, _custom: {
          remainingDuration: 'Noch ' + this.formatMinutes(this.$date(event.end._unixDateTime).diff(this.currDate, 'minutes'))
        }}
      }
    },

    methods: {
      formatMinutes,

      updateCurrDate() {
        let self = this
        this.currDate = this.$date()

        // Remove events that ended in the past (are over)
        if (this.events && this.events.length !== 0)
          for (let i = 0; i < this.events.length; i++) {
            if (this.$date().isAfter(this.events[i].end._unixDateTime))
              this.events.splice(i, 1)
          }

        setTimeout(() => { // Update every 60 seconds.
          self.updateCurrDate()
        }, 1000 * 60)
      },

      getOffsetInMinutes( date1, date2 ) {
        return this.$date(date1).diff(this.$date(date2), 'minute')
      } 
    },

    async mounted() {
      // Start the current date/time update interval
      this.updateCurrDate()

      // Handle automatically opening/closing list on scroll.
      let oldScrollPos = window.scrollY
      document.body.onscroll = e => {
        let dirIsDown = window.scrollY > oldScrollPos
        if (window.scrollY > 20 && dirIsDown)
          this.listOpened = true
        else if (window.scrollY <= 20 && !dirIsDown) 
          this.listOpened = false
        
        oldScrollPos = window.scrollY
      }

      // Init data
      const startTime = this.$date().hour(0).minute(0).second(0).format().split('+')[0],
            endTime   = this.$date().hour(23).minute(59).second(59).format().split('+')[0]

      let { value: events } = await this.msal.getCalendarData(startTime, endTime)
      if (!events)
        return

      // Remove all-day-events & events already passed by
      events = events.filter(event => {
        if (event.isAllDay)
          return false

        if (this.$date().isAfter(this.$date(event.end.dateTime + 'Z')))
          return false

        return true
      })

      // Add unix timestamps
      events = events.map(event => ({ 
        ...event, 
        start: { ...event.start, _unixDateTime: this.$date(event.start.dateTime + 'Z').valueOf() },
        end: { ...event.end, _unixDateTime: this.$date(event.end.dateTime + 'Z').valueOf() }
      }))
        
      // Sort events by date
      events = events.sort(( a, b ) => a.start._unixDateTime - b.start._unixDateTime)

      // console.log(JSON.parse(JSON.stringify(events)))

      this.events = events
    }
  }
</script>

<style lang="scss">
  .home {
    --height-navbar: 5.5rem;
  }

  .main {  
    height: 100vh;
    display: grid;
    grid-template-rows: 1fr min-content;
    padding: 0 1.5rem;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: var(--color-bg-primary);
    transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
    transition-duration: 600ms;
    transition-property: transform, background-color;

    &.listOpened {
      --height-navbar: 4.5rem;
      background-color: transparent;
      transform: translateY(calc(-100vh + var(--height-navbar)));

      .navbar {
        border-radius: 0 0 1.5rem 1.5rem;
        background: hsl(0, 0, 16, 0.4);
        backdrop-filter: blur(20px);

        button {
          transform: rotateX(180deg);
        }
      }
    }

    .hero {
      display: flex;
      align-items: center;
      justify-content: center;
      user-select: none;

      h1, p {
        text-align: center;
        color: var(--color-content-tertiary);
      }

      &.hasEvent {
        .badge {
          margin: 0 auto;
        }
        
        h1 {
          color: var(--color-content-primary);
          margin: .75rem 0;
        }
        
        p {
          color: var(--color-content-secondary);
        }
      }
    }

    .navbar {
      height: var(--height-navbar);
      display: flex;
      padding: 1.5rem 0;
      align-items: center;
      justify-content: center;

      button {
        transition: transform 700ms ease;
      }
    }
  }

  .list {
    text-align: center;
    min-height: 110vh;
    padding: calc(var(--height-navbar) + 5rem) 0 1rem;

    h1 {
      margin-bottom: 2rem;
    }
  }
</style>
