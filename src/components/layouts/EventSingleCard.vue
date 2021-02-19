<template>
  <article class="meeting" :class="{ answerRequired }">
    <div class="time">
      <p class="time-start isSmall" v-text="formattedTimes.start" />
      <p class="time-duration isSmall" v-text="formattedDuration" />
    </div>

    <div class="content">
      <div class="content-main">
        <EventTitle :event="event" />
        <EventInfoBar class="isSmall" v-if="event.location" :items="[ event.location ]" />

        <div class="content-menuButton">
          <Button type="iconOnly" primaryIcon="menu" @click="isEditModalOpened = true" />
        </div>
      </div>

      <div class="content-bottomBar" v-if="answerRequired">
        <Button v-if="!event.isCancelled" :primaryIcon="isTentativelyAccepted ? 'question' : 'check'" secondaryIcon="down" @click="isEditModalOpened = true">
          {{ isTentativelyAccepted ? 'Mit Vorbehalt ...' : 'Annehmen' }}
        </Button>

        <Button v-else :primaryIcon="'close'" @click="isEditModalOpened = true">
          Löschen
        </Button>
      </div>
    </div>

    <EventDetailsModal 
      :event="event" 
      :isOpened="isEditModalOpened" 
      :formattedTimes="formattedTimes"
      :formattedDuration="formattedDuration"
      :isAccepted="isAccepted"
      :isTentativelyAccepted="isTentativelyAccepted"
      :isDeclined="isDeclined"
      @close="isEditModalOpened = false" 
    />
  </article>
</template>

<script>
  import formatMinutes from '@/utils/formatMinutes'

  import EventDetailsModal from '@/components/layouts/EventDetailsModal'

  import Button from '@/components/ui/Button'
  import EventTitle from '@/components/ui/EventTitle'
  import EventInfoBar from '@/components/ui/EventInfoBar'

  export default {
    props: {
      event: { type: Object, required: true }
    },

    components: { 
      Button, EventTitle, EventInfoBar, 
      EventDetailsModal 
    },
    
    data: () => ({
      isEditModalOpened: false
    }),

    computed: {
      answerRequired() {
        let notAccepted = !this.isAccepted && !this.event.isOrganizer,
            cancelled = this.event.isCancelled

        return notAccepted || cancelled
      },

      formattedTimes() {
        return {
          start: this.$date(this.event.start._unixDateTime).format('HH:mm'),
          end: this.$date(this.event.end._unixDateTime).format('HH:mm')
        }
      },

      formattedDuration() {
        return this.formatMinutes(this.$date(this.event.end._unixDateTime).diff(this.event.start._unixDateTime, 'minute'), 'short')
      },

      isAccepted() {
        return this.event.responseStatus.response.toUpperCase() === 'ACCEPTED'
      },

      isTentativelyAccepted() {
        return this.event.responseStatus.response.toUpperCase() === 'TENTATIVELYACCEPTED'
      },

      isDeclined() { // When user has selected "Nicht teilnehmen".
        return this.event.responseStatus.response.toUpperCase() === 'DECLINED'
      },

      isCancelled() {
      }
    },

    methods: {
      formatMinutes
    }
  }
</script>

<style lang="scss" scoped>
  .meeting {
    --menu-btn-bg-rgb: 0, 0, 0;
    --border-width: 0.125rem;

    padding: 1rem 0;
    display: grid;
    grid-template-columns: 3.5rem 1fr;
    gap: .5rem;
    text-align: left;

    &.answerRequired {
      color: var(--color-content-secondary);

      .content .EventInfoBar {
        color: var(--color-content-tertiary)!important;
      }
    }

    .time {
      &-start {
        margin: 0.375rem 0 0.125rem;
        color: var(--color-content-secondary);
      }

      &-duration {
        color: var(--color-content-tertiary);
      }
    }

    .content {
      position: relative;

      p {
        color: var(--color-content-secondary);
      }

      &:hover {
        .content-menuButton {
          opacity: 1!important;
          visibility: visible!important;
        }
      }

      &-bottomBar {
        margin: .75rem 0 0 0;
        // border-top: var(--border-width) solid var(--color-bg-secondary);

        .button {
          margin: 0 0 0 -.5rem;
        }
      }

      &-menuButton {
        opacity: 0;
        visibility: hidden;
        height: 3rem;
        width: 3rem;
        top: -.75rem;
        right: -1rem;
        position: absolute;
        z-index: 100;
        display: flex;
        align-items: center;
        justify-content: center;
        background: radial-gradient(50% 50% at 50% 50%, 
          rgba(var(--menu-btn-bg-rgb), 0.95) 50%, 
          rgba(var(--menu-btn-bg-rgb), 0) 100%
        );
        transition: opacity 150ms ease, visibility 150ms ease;
      }

      .EventInfoBar {
        margin-top: .25rem;
        color: var(--color-content-secondary);
      }
    }
  }
</style>
