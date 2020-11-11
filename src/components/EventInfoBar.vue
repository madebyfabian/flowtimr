<template>
  <ul class="EventInfoBar copy">
    <li v-for="(item, key) of items.filter(Boolean)" :key="key">
      <a 
        v-if="valueIsLocationObj(item) && item._redirectTo" 
        :href="item._redirectTo"
        rel="noopener"
        target="_blank">

        {{ item._text }}
        <inline-svg :src="require('../assets/icons/icon-top-right.svg')" />
      </a>
      <span 
        v-else
        v-text="valueIsLocationObj(item) ? item._text : item" />

      <span class="EventInfoBar-seperator" v-if="key + 1 !== items.length" v-text="'–'" />
    </li>
  </ul>
</template>

<script>
  export default {
    props: {
      items: { type: Array, required: true }
    },
    
    methods: {
      valueIsLocationObj( val ) {
        return typeof val === 'object' && val._text
      }
    }
  }
</script>

<style lang="scss" scoped>
  .EventInfoBar {
    word-break: break-word;
    display: inline-flex;
    flex-wrap: wrap;
    justify-content: center;

    &-seperator {
      margin: 0 .66ch;
      display: inline-block;
    }

    a, span {
      color: var(--color-content-secondary);
    }

    span {
      white-space: nowrap;
    }

    a {
      --icon-spacing: .25ch;
      --icon-size: 1.75ch;
      display: inline-flex;
      flex-shrink: 0;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        width: calc(100% - var(--icon-size) - var(--icon-spacing));
        display: block;
        height: 1px;
        bottom: 0;
        left: 0;
        background-color: var(--color-content-tertiary);
        border-radius: 1px;
        transition: background-color 150ms ease;
        // transform-origin: left center;
        // transform: scale(1, 1);
      }

      svg {
        height: var(--icon-size);
        width: var(--icon-size);
        color: var(--color-content-tertiary);
        margin-left: var(--icon-spacing);
        transition: transform 150ms ease;
      }

      &:hover {
        &::after {
          // transform-origin: right center;
          // transform: scale(0, 1);
          background-color: var(--color-content-secondary);
        }

        svg {
          transform: translate(.125rem, -.125rem);
        }
      }
    }
  }
</style>