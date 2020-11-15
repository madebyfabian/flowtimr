<template>
  <div class="eventNextUp" :class="{ isClose: event._custom.isClose }">
    <Badge 
      class="eventNextUp-badge" 
      :type="event._custom.isClose ? 'active' : 'default'"
      v-text="event._custom.offsetStr" 
    />
    <EventTitle :event="event" class="eventNextUp-subject" />
    <EventInfoBar class="eventNextUp-info isSmall" :items="[ 
      formattedDuration, 
      event.location
    ]" />
  </div>
</template>

<script>
  import formatMinutes from '@/utils/formatMinutes'

  import Badge from '@/components/ui/Badge'
  import EventTitle from '@/components/ui/EventTitle'
  import EventInfoItem from '@/components/ui/EventInfoItem'
  import EventInfoBar from '@/components/ui/EventInfoBar'

  export default {
    props: {
      event: { type: Object, required: true }
    },

    components: { Badge, EventTitle, EventInfoBar },

    computed: {
      formattedDuration() {
        return this.formatMinutes(this.$date(this.event.end._unixDateTime).diff(this.event.start._unixDateTime, 'minute'), 'short')
      }
    },

    methods: {
      formatMinutes
    }
  }
</script>

<style lang="scss" scoped>
  .eventNextUp {
    --title: var(--color-content-secondary);
    --subtitle: var(--color-content-tertiary);
    margin-right: 1.5rem;

    &.isClose {
      --title: var(--color-content-primary);
      --subtitle: var(--color-content-secondary);
    }

    &-subject {
      margin: .75rem 0 .25rem;
      color: var(--title);
    }

    &-info {
      color: var(--subtitle)
    }
  }
</style>