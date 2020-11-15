<template>
  <a 
    v-if="isLocationObj && item._redirectTo" 
    class="EventInfoItem"
    :href="item._redirectTo"
    rel="noopener"
    target="_blank">

    {{ item._text }}
    <img v-svg-inline src="../../assets/icons/icon-top-right.svg">
  </a>

  <span 
    v-else
    class="EventInfoItem"
    v-text="isLocationObj ? item._text : item" 
  />
</template>

<script>
  import { computed } from 'vue'

  export default {
    props: {
      item: { type: [ Object, String ], required: true }
    },

    setup: props => ({
      isLocationObj: computed(() => typeof props.item === 'object' && '_text' in props.item)
    })
  }
</script>

<style lang="scss" scoped>
  span {
    white-space: nowrap;
  }

  a {
    --icon-spacing: .25ch;
    --icon-size: 1.75ch;
    display: inline-flex;
    flex-shrink: 0;
    position: relative;

    svg {
      opacity: .5;
      height: var(--icon-size);
      width: var(--icon-size);
      margin-left: var(--icon-spacing);
      transition: transform 150ms ease;
    }

    &:hover svg {
      transform: translate(.125rem, -.125rem);
    }
  }
</style>