<template>
  <div v-if="event" class="EventAttendees copy isSmall">
    <Avatar :name="name" />
    <span 
      class="EventAttendees-name" 
      v-text="displayName" 
      :title="name" 
    />
    <span 
      v-if="attendeesAmount > 1"
      class="EventAttendees-additionalAmount" 
      v-text="`— ${ attendeesAmount} Teilnehmer`" 
      :title="attendeesList"
    />
  </div>
</template>

<script>
  import { Avatar } from '@/components/ui'

  export default {
    props: {
      event: { type: Object, required: true }
    },

    components: { Avatar },

    computed: {
      name() {
        return this.event.organizer.emailAddress.name
      },

      displayName() {
        return this.event.isOrganizer 
          ? this.name + ' (Ich)'
          : (!this.name.includes('@') ? this.name : this.name.split('@')[0] + '...')
      },

      attendeesAmount() {
        return this.event.attendees.length + 1
      },

      attendeesList() {
        let attendees = this.event.attendees
        if (!attendees.length)
          return []

        return attendees.map(person => person.emailAddress.name).join('; ')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .EventAttendees {
    color: var(--color-content-secondary);
    display: flex;
    align-items: center;

    &-name {
      margin: 0 .375rem 0 .5rem 
    }

    &-additionalAmount {
      color: var(--color-content-tertiary);
    }
  }
</style>