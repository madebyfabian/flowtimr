<template>
  <p>
    <span v-for="(item, key) of items" :key="key">
      {{ item || null }} {{ item && key + 1 !== items.length ? '–' : null }}
    </span>
  </p>
</template>

<script>
  export default {
    props: {
      items: { type: Array, required: true }
    }
  }
</script>

<style lang="scss" scoped>
  p {
    word-break: break-word;

    span {
      white-space: nowrap;
    }
  }
</style>