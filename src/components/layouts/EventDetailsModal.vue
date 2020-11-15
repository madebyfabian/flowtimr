<template>
  <Modal :isOpened="isOpened" @close="handleCloseModal" class="EventDetailsModal">
    <EventTitle :event="event" />
    <ul class="infoList copy isSmall">
      <li>
        <EventAttendees class="infoList-item" :event="event" />
      </li>

      <li>
        <img v-svg-inline class="infoList-icon" src="../../assets/icons/icon-time.svg">
        {{ formattedTimes.start }} &rarr; {{ formattedTimes.end }}
        <span class="infoList-secondary" v-text="`— ${ formattedDuration }`" />
      </li>

      <li v-if="event.location._text">
        <img v-svg-inline class="infoList-icon" src="../../assets/icons/icon-location.svg">
        <EventInfoItem :item="event.location" />
      </li>

      <li v-if="event.bodyPreview">
        <img v-svg-inline class="infoList-icon" src="../../assets/icons/icon-text.svg">
        <span class="infoList-truncated">{{ event.bodyPreview }}</span>
      </li>
    </ul>

    <div class="buttons" :class="{ isHidden: updatingEventResponse || errorUpdatingEventResponse }">
      <LoadingSpinner v-if="updatingEventResponse" class="buttons-overlay" />
      <p v-if="errorUpdatingEventResponse" class="buttons-overlay error">Netzwerkfehler. Bitte nochmal versuchen.</p>

      <div v-if="!event.isOrganizer && !event.isCancelled" class="buttons-group">
        <Button
          v-for="(button, key) of modalButtons"
          :key="key"
          @click="setEventAnswer(button.event)"
          :class="`modalBtn-${button.className}`"
          :primaryIcon="button.icon"
          :isSelected="button.currVal">
          {{ button.label }}
        </Button>
      </div>

      <Button
        v-else
        @click="setEventAnswer('isCancelled')"
        class="modalBtn-cancel" 
        :primaryIcon="event.isOrganizer ? 'event-cancel' : 'close'">
        {{ event.isCancelled ? 'Aus Kalender löschen' : 'Absagen und Löschen' }}
      </Button>
    </div>
  </Modal>
</template>

<script>
  import { store, mutations } from '@/store'

  import EventAttendees from '@/components/layouts/EventAttendees'
  
  import Button from '@/components/ui/Button'
  import Modal from '@/components/ui/Modal'
  import LoadingSpinner from '@/components/ui/LoadingSpinner'
  import EventTitle from '@/components/ui/EventTitle'
  import EventInfoItem from '@/components/ui/EventInfoItem'
  
  export default {
    props: {
      event: { required: true },
      isOpened: { required: true },
      formattedTimes: { required: true },
      formattedDuration: { required: true },
      isAccepted: { required: true },
      isTentativelyAccepted: { required: true },
      isDeclined: { required: true }
    },

    data: () => ({
      updatingEventResponse: false,
      errorUpdatingEventResponse: null
    }),

    components: { Button, Modal, LoadingSpinner, EventTitle, EventInfoItem, EventAttendees },

    computed: {
      APIService: () => store.APIService,

      modalButtons() {return [
        { event: 'isAccepted', className: 'accept', currVal: this.isAccepted, 
          label: this.isAccepted ? 'Angenommen' : 'Annehmen', icon: 'check' },

        { event: 'isTentativelyAccepted', className: 'tentativelyAccept', currVal: this.isTentativelyAccepted, 
          label: this.isTentativelyAccepted ? 'Mit Vorbehalt angenommen' : 'Mit Vorbehalt', icon: 'question' },

        { event: 'isDeclined', className: 'decline', currVal: this.isDeclined,
          label: this.isDeclined ? 'Abgelehnt' : 'Ablehnen', icon: 'close' }
      ]}
    },

    methods: {
      fetchAndUpdateEvents: mutations.fetchAndUpdateEvents,

      handleCloseModal() {
        this.errorUpdatingEventResponse = false
        this.$emit('close')
      },

      async setEventAnswer( action ) {
        // Quit, if the action is already been made (e.g. if the action is "accept" and the event is already accepted).
        if (this[action])
          return this.handleCloseModal()

        this.updatingEventResponse = true
        
        try {
          this.errorUpdatingEventResponse = false

          // Call API
          await this.APIService.postEventAnswer(this.event.id, action)

          // Update Events data
          await this.fetchAndUpdateEvents()

          this.handleCloseModal()
        } catch (err) {
          console.error(err)
          this.errorUpdatingEventResponse = true
        }

        this.updatingEventResponse = false
      }
    }
  }
</script>

<style lang="scss" scoped>
  .EventDetailsModal {
    h2 {
      margin-right: 2.5rem;
      color: var(--color-content-primary);
    }

    .EventInfoBar {
      margin: .5rem 0 1.5rem;
      color: var(--color-content-secondary);
    }

    .infoList {
      border-bottom: 2px solid var(--color-bg-tertiary);
      margin: 1rem 0;
      padding: 0 0 .5rem;
      color: var(--color-content-secondary);

      li {
        margin-bottom: .75rem;
        display: flex;

        .infoList-icon, .infoList-secondary {
          color: var(--color-content-tertiary);
        }

        .infoList-icon {
          height: 1rem;
          width: 1rem;
          flex-shrink: 0;
          margin: .125rem calc(.5rem - 1px) 0 -1px
        }
        
        .infoList-secondary {
          display: block;
          margin-left: .375rem;
        }

        .infoList-truncated {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
        }
      }
    }

    .buttons {
      position: relative;
      margin-bottom: -.5rem;
      

      &-group {
        display: grid;
        gap: .5rem;
        grid-template-rows: repeat(3, 1fr);
      }

      &.isHidden .button {
        visibility: hidden!important
      }

      &-overlay {
        position: absolute;
        width: 100%;
        display: flex;
        align-items: center;
        top: 1.5rem;

        &.error {
          color: var(--color-red-primary);
          margin: 0;
          text-align: center;
        }
      }

      .button {
        width: calc(100% + 1rem);
        margin: 0 -.5rem;

        &:last-child {
          margin-top: 0;
        }
        
        &.modalBtn-accept {
          margin-top: 0;

          &[isSelected=true] {
            color: var(--color-brand-primary)!important;
          }
        }
      }
    }
  }
</style>