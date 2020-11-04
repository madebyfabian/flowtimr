<template>
  <p>
    <span v-for="(item, key) of items" :key="key">
      {{ key && item ? '–' : null }} {{ item || null }}
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