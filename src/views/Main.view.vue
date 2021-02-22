<template>
	<div class="home">
		<div v-if="events !== null">
			<section class="main" :class="{ listOpened }">
				<div class="hero" :class="{ hasEvent: currActiveEventData }">
					<div v-if="currActiveEventData">
						<Badge :type="`active`">Jetzt</Badge>
						<EventTitle :size="1" :event="currActiveEventData" />
						<EventInfoBar :items="[ 
							currActiveEventData._custom.remainingDuration.trim(),
							currActiveEventData.location
						]" />
					</div>
				
					<h1 v-else-if="nextEventData">Flowtime.</h1>
					<h1 v-else>Alles erledigt<br>für heute.<br><br><span style="opacity: .5">🎉</span></h1>
				</div>

				<div class="eventNextUp-wrapper" v-if="allUpcomingEvents.length !== 0">
					<EventNextUp v-if="nextEventData" :event="nextEventData" />

					<button @click="openList">
						<Icon name="down" />
					</button>
				</div>
			</section>

			<section v-if="allUpcomingEvents.length !== 0" class="list">
				<h1>Was steht <br>noch an?</h1>
				<EventSingleCard 
					v-for="event of allUpcomingEvents" 
					:key="event.id"
					:event="event" 
				/>
			</section>

			<FixedTopBar :isShown="fixedTopBarShown" />
		</div>
	</div>
</template>

<script>
  import '@/scss/main.scss'

  import PushNotification from '@/services/PushNotification'
  import formatMinutes from '@/utils/formatMinutes'
  import { store, mutations } from '@/store'

  import EventSingleCard from '@/components/layouts/EventSingleCard'
  import EventNextUp from '@/components/layouts/EventNextUp'

  import Badge from '@/components/ui/Badge'
  import EventTitle from '@/components/ui/EventTitle'
  import EventInfoBar from '@/components/ui/EventInfoBar'
  import FixedTopBar from '@/components/ui/FixedTopBar'
  import Icon from '@/components/ui/Icon'
  

  export default {
    name: 'Home',

    components: { 
      Badge, EventTitle, EventInfoBar, EventSingleCard, FixedTopBar, Icon,
      EventNextUp
    },

    data: function() { return {
      listOpened: false,
      fixedTopBarShown: false,
      currDate: this.$date()
    }},
    
    computed: {
      events: () => store.events,

      nextEventData() {
        let event = this.events.find(event => this.currDate.isBefore(this.$date(event.start._unixDateTime)))
        if (!event)
          return null

        let offsetMin = this.getOffsetInMinutes(event.start._unixDateTime, this.currDate),
            isClose = offsetMin <= 15

        // Send push notification when event is 1 minute away.
        if (offsetMin === 1)
          new PushNotification(event.subject)

        let offsetStr = 'In '
        if (this.currActiveEventData) {
          let currAndNextEventOffsetMin = this.getOffsetInMinutes(this.currActiveEventData.end._unixDateTime, event.start._unixDateTime)
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
          durationStr: this.formatMinutes(this.getOffsetInMinutes(event.end._unixDateTime, event.start._unixDateTime), 'short')
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
          remainingDuration: 'Noch ' + this.formatMinutes(this.getOffsetInMinutes(event.end._unixDateTime, this.currDate))
        }}
      },

      /**
       * Get all upcoming events that haven't started yet 
       */
      allUpcomingEvents() {
        if (!this.events)
          return null
        return this.events.filter(event => this.$date(event.start._unixDateTime).isAfter(this.currDate))
      }
    },

    methods: {
      formatMinutes,
      fetchAndUpdateEvents: mutations.fetchAndUpdateEvents,

      listScrollAnimation() {
        let oldScrollPos = window.scrollY

        document.body.onscroll = e => {
          if (!this.events || this.events.length === 0)
            return

          let dirIsDown = window.scrollY > oldScrollPos

          // open list
          if (window.scrollY > 50 && dirIsDown)
            this.listOpened = true
          else if (window.scrollY <= 50 && !dirIsDown) 
            this.listOpened = false

          // show fixed top bar 
          if (window.scrollY > 200 && dirIsDown)
            this.fixedTopBarShown = true
          else if (window.scrollY <= 200 && !dirIsDown)
            this.fixedTopBarShown = false
          
          oldScrollPos = window.scrollY
        }
      },

      updateCurrDate() {
        this.currDate = this.$date()

        if (!this.events || this.events.length === 0)
          return

        // Remove events that ended in the past (are over)
        for (let i = 0; i < this.events.length; i++) {
          if (this.$date().isAfter(this.events[i].end._unixDateTime))
            this.events.splice(i, 1)
        }
      },

      getOffsetInMinutes( date1, date2 ) {
        return this.$date(date1).diff(this.$date(date2), 'minute') + 1
      },

      openList() {
        window.scrollTo({
          top: 100,
          behavior: 'smooth'
        })
      }
    },

    async mounted() {
      // Fetch all events
      this.fetchAndUpdateEvents()

      // Start the "updateCurrDate" function exactly when new minute begins, every 60 seconds
      setTimeout(() => {
        this.updateCurrDate()
        setInterval(() => {
          this.updateCurrDate()
        }, 60 * 1000)
      }, (60 - this.$date().second()) * 1000)

      setInterval(() => {
        this.fetchAndUpdateEvents()
      }, 5 * 60 * 1000) // 5 minutes

      // Handle automatically opening/closing list on scroll.
      this.listScrollAnimation()
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
    z-index: 200;

    &.listOpened {
      background-color: transparent;
      transform: translateY(-100vh);
    }

    .hero {
      display: flex;
      align-items: center;
      user-select: none;
      margin-right: 1rem;

      .EventInfoBar {
        color: var(--color-content-secondary);
      }

      h1, p {
        color: var(--color-content-tertiary);
      }

      &.hasEvent {
        h1 {
          color: var(--color-content-primary);
          margin: 1rem 0 .75rem;
        }
        
        p {
          color: var(--color-content-secondary);
        }
      }
    }

    .eventNextUp-wrapper {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-bottom: 2.5rem;

      button {
        flex-shrink: 0;
        margin-right: 0;
        margin-left: auto;
        height: 2.5rem;
        width: 2.5rem;
        border-radius: 2.5rem;
        box-shadow: inset 0 0 0 4px var(--color-bg-secondary);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        background: transparent;
        outline: none;
        border-style: none;
        cursor: pointer;
        color: var(--color-content-tertiary);
      }
    }
  }

  .list {
    min-height: calc(100vh + 100px);
    padding: calc(100px + 2.5rem) 1.5rem 1rem;

    h1 {
      margin-bottom: 1rem;
    }
  }
</style>
