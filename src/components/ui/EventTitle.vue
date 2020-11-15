<template>
  <component 
    :is="size === 1 ? 'h1' : 'h2'"
    class="EventTitle"
    :class="{ isCancelled }"
    v-html="content"
  />
</template>

<script>
  import { computed } from 'vue'

  export default {
    props: {
      size: { type: Number, default: 2, validate: val => [ 1, 2 ].includes(val) },
      event: { type: Object, required: true }
    },

    setup( props ) {
      const content = computed(() => {
        let subject = props.event?.subject
        if (!subject?.length) return '(Kein Titel)'

        // Adding hidden word breaks for "foo/bar", "foo&bar" or "foo@bar".
        return subject.trim().replace(/(?=\S)(\&|\/|\@)(?=\S)/g, '$&<wbr>')
      })

      const isCancelled = props.event?.isCancelled

      return { content, isCancelled }
    }
  }
</script>

<style lang="scss" scoped>
  .EventTitle {
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    overflow: hidden;

    &.isCancelled {
      text-decoration: line-through;
    }
  }
</style>