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
        return typeof val === 'object' && '_text' in val
      }
    }
  }
</script>

<style lang="scss" scoped>
  .EventInfoBar {
    word-break: break-word;
    display: inline-flex;
    flex-wrap: wrap;

    &-seperator {
      margin: 0 .66ch;
      display: inline-block;
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

      &::after, svg {
        opacity: .5;
      }

      &::after {
        content: '';
        position: absolute;
        width: calc(100% - var(--icon-size) - var(--icon-spacing));
        display: block;
        height: 1px;
        bottom: 0;
        left: 0;
        background-color: currentColor;
        border-radius: 1px;
        transition: opacity 150ms ease;
      }

      svg {
        height: var(--icon-size);
        width: var(--icon-size);
        margin-left: var(--icon-spacing);
        transition: transform 150ms ease;
      }

      &:hover {
        &::after {
          opacity: .75;
        }

        svg {
          transform: translate(.125rem, -.125rem);
        }
      }
    }
  }
</style>