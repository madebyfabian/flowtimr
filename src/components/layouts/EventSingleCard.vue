<template>
  <article class="meeting" :class="{ answerRequired }">
    <div class="time">
      <p class="isSmall time-start">{{ formattedStartTime }}</p>
      <p class="isSmall time-duration">{{ formattedDuration }}</p>
    </div>

    <div class="content">
      <div class="content-main">
        <EventTitle :event="event" />
        <EventInfoBar class="isSmall" :items="[ event.location ]" />

        <div class="content-menuButton">
          <Button type="iconOnly" primaryIcon="menu" @click="isEditModalOpened = true" />
        </div>
      </div>

      <div class="content-bottomBar" v-if="answerRequired">
        <Button v-if="!isCancelled" :primaryIcon="isTentativelyAccepted ? 'question' : 'check'" secondaryIcon="down" @click="isEditModalOpened = true">
          {{ isTentativelyAccepted ? 'Mit Vorbehalt ...' : 'Annehmen' }}
        </Button>

        <Button v-else :primaryIcon="'close'" @click="isEditModalOpened = true">
          Löschen
        </Button>
      </div>
    </div>

    <Modal :isOpened="isEditModalOpened" @close="isEditModalOpened = false">
      <EventTitle :event="event" />
      <EventInfoBar class="isSmall" :items="[
        formattedStartTime,
        formattedDuration,
        event.location
      ]" />

      <div class="buttons" :class="{ isHidden: updatingEventResponse || errorUpdatingEventResponse }">
        <LoadingSpinner v-if="updatingEventResponse" class="buttons-overlay" />
        <p v-if="errorUpdatingEventResponse" class="buttons-overlay error">Netzwerkfehler. Bitte nochmal versuchen.</p>

        <div v-if="!event.isOrganizer && !isCancelled">
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
          :primaryIcon="event.isOrganizer ? 'event-cancel' : 'close'">
          {{ isCancelled ? 'Aus Kalender löschen' : 'Absagen und Löschen' }}
        </Button>
      </div>
    </Modal>
  </article>
</template>

<script>
  import { store, mutations } from '@/store'
  import formatMinutes from '@/utils/formatMinutes'
  import { Button, Modal, LoadingSpinner, EventTitle, EventInfoBar } from '@/components/ui'

  export default {
    props: {
      event: { type: Object, required: true }
    },

    components: { Button, Modal, LoadingSpinner, EventTitle, EventInfoBar },
    
    data: () => ({
      isEditModalOpened: false,
      updatingEventResponse: false,
      errorUpdatingEventResponse: null
    }),

    computed: {
      APIService: () => store.APIService,

      answerRequired() {
        let notAccepted = !this.isAccepted && !this.event.isOrganizer,
            cancelled = this.isCancelled

        return notAccepted || cancelled
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
      margin-right: 2.5rem;
      color: var(--color-content-primary);
    }

    .EventInfoBar {
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
        margin: .5rem 0 .25rem;
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
