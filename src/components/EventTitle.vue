<template>
  <h1 v-if="size === 1" class="EventTitle" :class="classList" v-html="content" />
  <h2 v-else            class="EventTitle" :class="classList" v-html="content" />
</template>

<script>
  export default {
    props: {
      size: { type: Number, default: 2, validate: val => [ 1, 2 ].includes(val) },
      event: { type: Object, required: true }
    },
    
    computed: {
      content() {
        // Adding hidden word breaks for "foo/bar", "foo&bar" or "foo@bar".
        return this.event.subject.trim().replace(/(?=\S)(\&|\/|\@)(?=\S)/g, '$&<wbr>')
      },

      classList() { return {
        isCancelled: this.event.isCancelled
      }}
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