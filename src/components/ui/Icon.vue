<template>
  <img v-svg-inline class="Icon" :src="iconSrc" :alt="name">
</template>

<script>
  import { computed } from 'vue'

  export default {
    props: {
      name: { type: String, required: true, validator: val => val.length }
    },

    setup( props ) {
      const iconSrc = computed(() => require(`../../assets/icons/icon-${props.name}.svg`))
      return { iconSrc }
    }
  }
</script>

<style lang="scss" scoped>
  .Icon {
    height: 1.5rem;
    width: 1.5rem;
  }
</style>