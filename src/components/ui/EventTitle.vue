<template>
  <h1 v-if="size === 1" class="EventTitle" :class="classList" v-html="content || '(Kein Titel)'" />
  <h2 v-else            class="EventTitle" :class="classList" v-html="content || '(Kein Titel)'" />
</template>

<script>
  export default {
    props: {
      size: { type: Number, default: 2, validate: val => [ 1, 2 ].includes(val) },
      event: { type: Object, required: true }
    },

    computed: {
      content() {
        let subject = this.event.subject
        if (!subject || !subject.length)  
          return ''

        // Adding hidden word breaks for "foo/bar", "foo&bar" or "foo@bar".
        return subject.trim().replace(/(?=\S)(\&|\/|\@)(?=\S)/g, '$&<wbr>')
      },

      classList() { return {
        isCancelled: this.event.isCancelled,
        isEmpty: this.isEmpty
      }},

      isEmpty() {
        return !this.content || !this.content.length
      }
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