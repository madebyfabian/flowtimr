<template>
  <article class="meeting">
    <div class="time">
      <p class="isSmall time-start">{{ formattedStartTime }}</p>
      <p class="isSmall time-duration">{{ formattedDuration }}</p>
    </div>

    <div class="content">
      <h2 class="content-title" v-html="event.subject" />
      <p class="content-info isSmall" v-if="event.location.displayName">{{ event.location.displayName }}</p>
    </div>
  </article>
</template>

<script>
  import formatMinutes from '@/utils/formatMinutes'
  

  export default {
    props: {
      event: { type: Object, required: true }
    },

    methods: {
      formatMinutes
    },

    computed: {
      formattedStartTime() {
        return this.$date(this.event.start._unixDateTime).format('HH:mm')
      },

      formattedDuration() {
        return this.formatMinutes(this.$date(this.event.end._unixDateTime).diff(this.event.start._unixDateTime, 'minute'), 'short')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .meeting {
    margin: 1rem 1.5rem;
    display: grid;
    grid-template-columns: 3.5rem 1fr;
    gap: .5rem;
    text-align: left;

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
      padding: .75rem 1rem;
      border-radius: 1rem;
      background: var(--color-bg-secondary);

      &-info {
        margin-top: .5rem;
        color: var(--color-content-secondary);
      }
    }
  }
</style>
