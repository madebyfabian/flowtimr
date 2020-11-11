<template>
  <div class="eventNextUp" :class="{ isClose: event._custom.isClose }">
    <Badge 
      class="eventNextUp-badge" 
      :type="event._custom.isClose ? 'active' : 'default'"
      v-text="event._custom.offsetStr" 
    />
    <h2 class="eventNextUp-subject" v-html="event.subject" />
    <EventInfoBar class="eventNextUp-info isSmall" :items="[ 
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
    margin-right: 1.5rem;

    &-subject {
      margin: .75rem 0 .25rem;
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