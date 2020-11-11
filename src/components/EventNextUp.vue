<template>
  <div class="eventNextUp" :class="{ isClose: event._custom.isClose }">
    <Badge 
      class="eventNextUp-badge" 
      :type="event._custom.isClose ? 'blue' : 'default'"
      v-text="event._custom.offsetStr" 
    />
    <h2 class="eventNextUp-subject" v-html="event.subject" />
    <EventInfoBar class="eventNextUp-info isSmall" :items="[ 
      event._custom.startTimeStr.trim(), 
      event._custom.durationStr.trim(), 
      event.location
    ]" />
  </div>
</template>

<script>
  import Badge from '@/components/Badge'
  import EventInfoBar from '@/components/EventInfoBar'

  export default {
    props: {
      event: { type: Object, required: true }
    },
    
    components: { Badge, EventInfoBar }
  }
</script>

<style lang="scss" scoped>
  .eventNextUp {
    text-align: center;
    margin: 0 1rem;
    
    &-badge {
      margin: 0 auto .75rem;
    }

    &-subject {
      margin-bottom: .5rem;
      color: var(--color-content-secondary);
    }

    &-info {
      color: var(--color-content-tertiary)
    }

    &.isClose {
      .nextUp-subject {
        color: var(--color-content-primary);
      }

      .nextUp-info {
        color: var(--color-content-secondary);
      }
    }
  }
</style>