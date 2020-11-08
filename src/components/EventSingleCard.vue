<template>
  <article class="meeting" :class="{ notAnswered: !isRequired }">
    <div class="time">
      <p class="isSmall time-start">{{ formattedStartTime }}</p>
      <p class="isSmall time-duration">{{ formattedDuration }}</p>
    </div>

    <div class="content">
      <div class="content-main">
        <h2 v-html="event.subject" />
        <p class="isSmall" v-if="event.location.displayName">{{ event.location.displayName }}</p>

        <div class="content-menuButton">
          <Button type="iconOnly" primaryIcon="menu" @click="isEditModalOpened = true" />
        </div>
      </div>

      <div class="content-bottomBar" v-if="!isRequired">
        <Button 
          :primaryIcon="isTentativelyAccepted ? 'question' : 'check'" 
          secondaryIcon="down" 
          @click="isEditModalOpened = true">
          
          {{ isTentativelyAccepted ? 'Mit Vorbehalt ...' : 'Annehmen' }}
        </Button>
      </div>
    </div>

    <Modal :isOpened="isEditModalOpened" @close="isEditModalOpened = false">
      <h2 v-html="event.subject" />
      <EventInfoBar class="isSmall" :items="[
        formattedStartTime,
        formattedDuration,
        event.location.displayName || null
      ]" />

      <div class="buttons" :class="{ isHidden: updatingEventResponse || errorUpdatingEventResponse }">
        <LoadingSpinner v-if="updatingEventResponse" class="buttons-overlay" />
        <p v-if="errorUpdatingEventResponse" class="buttons-overlay error">Netzwerkfehler. Bitte nochmal versuchen.</p>

        <div v-if="!event.isOrganizer">
          <Button 
            @click="setEventAnswer('isAccepted')"
            class="modalBtn-accept" 
            primaryIcon="check" 
            :isSelected="isAccepted">
            {{ isAccepted ? 'Angenommen' : 'Annehmen' }}
          </Button>

          <Button 
            @click="setEventAnswer('isTentativelyAccepted')"
            class="modalBtn-tentativelyAccept" 
            primaryIcon="question" 
            :isSelected="isTentativelyAccepted">
            {{ isTentativelyAccepted ? 'Mit Vorbehalt angenommen' : 'Mit Vorbehalt' }}
          </Button>

          <Button 
            @click="setEventAnswer('isDeclined')"
            class="modalBtn-decline" 
            primaryIcon="close" 
            :isSelected="isDeclined">
            {{ isDeclined ? 'Abgelehnt' : 'Ablehnen' }}
          </Button>
        </div>

        <Button 
          v-else 
          @click="setEventAnswer('isCancelled')"
          class="modalBtn-cancel" 
          primaryIcon="event-cancel">
          Absagen und Löschen
        </Button>
      </div>
    </Modal>
  </article>
</template>

<script>
  import formatMinutes from '@/utils/formatMinutes'
  import Button from '@/components/Button'
  import Modal from '@/components/Modal'
  import LoadingSpinner from '@/components/LoadingSpinner'
  import EventInfoBar from '@/components/EventInfoBar'

  import { store, mutations } from '@/store'


  export default {
    props: {
      event: { type: Object, required: true }
    },

    components: { Button, Modal, LoadingSpinner, EventInfoBar },
    
    data: () => ({
      isEditModalOpened: false,
      updatingEventResponse: false,
      errorUpdatingEventResponse: null
    }),

    computed: {
      APIService: () => store.APIService,

      isRequired() { // When user MUST attend this event.
        return this.isAccepted || this.event.isOrganizer
      },

      formattedStartTime() {
        return this.$date(this.event.start._unixDateTime).format('HH:mm')
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
        return this.event.isCancelled
      }
    },

    watch: {
      isEditModalOpened() {
        this.errorUpdatingEventResponse = false
      }
    },

    methods: {
      formatMinutes,
      fetchAndUpdateEvents: mutations.fetchAndUpdateEvents,

      async setEventAnswer( action ) {
        // Quit, if the action is already been made (e.g. if the action is "accept" and the event is already accepted).
        if (this[action])
          return this.isEditModalOpened = false

        this.updatingEventResponse = true
        
        try {
          this.errorUpdatingEventResponse = false

          // Call API
          await this.APIService.postEventAnswer(this.event.id, action)

          // Update Events data
          await this.fetchAndUpdateEvents()

          this.isEditModalOpened = false
        } catch (err) {
          console.error(err)
          this.errorUpdatingEventResponse = true
        }

        this.updatingEventResponse = false
      },

      async handleTentativelyAcceptEvent() {
        if (this.isTentativelyAccepted)
          return this.isEditModalOpened = false

        this.updatingEventResponse = true

        // ...
      },

      async handleDeclineEvent() {
        if (this.isDeclined)
          return this.isEditModalOpened = false

        this.updatingEventResponse = true

        // ...
      }
    }
  }
</script>

<style lang="scss" scoped>
  .modal {
    h2 {
      margin-right: 5rem;
    }

    p {
      margin: .5rem 0 1.5rem;
      color: var(--color-content-secondary);
    }

    .buttons {
      position: relative;

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
        margin: 0.5rem -.5rem 0;
        
        &.modalBtn-accept {
          margin-top: 0;

          &[isSelected=true] {
            color: var(--color-brand-primary)!important;
          }
        }
      }
    }
  }

  .meeting {
    --menu-btn-bg-rgb: 20, 20, 20;
    --border-width: 0.125rem;

    margin: 1rem 1.5rem;
    display: grid;
    grid-template-columns: 3.5rem 1fr;
    gap: .5rem;
    text-align: left;

    &.notAnswered {
      --menu-btn-bg-rgb: 0, 0, 0;

      .content {
        box-shadow: inset 0 0 0 var(--border-width) var(--color-bg-secondary);
        background: transparent!important;
      }
    }

    .time {
      align-self: center;
      
      &-start {
        color: var(--color-content-secondary);
        margin-bottom: .25rem;
      }

      &-duration {
        color: var(--color-content-tertiary);
      }
    }

    .content {
      border-radius: 1rem;
      background: var(--color-bg-secondary);
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

      &-main {
        padding: .75rem 1rem;
      }

      &-bottomBar {
        padding: .5rem .5rem .625rem;
        border-top: var(--border-width) solid var(--color-bg-secondary);
      }

      &-menuButton {
        opacity: 0;
        visibility: hidden;
        height: 3rem;
        width: 3rem;
        top: 0;
        right: 0;
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

      p {
        margin-top: .5rem;
      }
    }
  }
</style>
