<template>
  <a 
    v-if="isLocationObj && item._redirectTo" 
    :href="item._redirectTo"
    rel="noopener"
    target="_blank">

    {{ item._text }}
    <inline-svg :src="require('../../assets/icons/icon-top-right.svg')" />
  </a>

  <span 
    v-else
    v-text="isLocationObj ? item._text : item" 
  />
</template>

<script>
  export default {
    props: {
      item: { type: [ Object, String ], required: true }
    },

    computed: {
      isLocationObj() {
        return typeof this.item === 'object' && '_text' in this.item
      }
    }
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