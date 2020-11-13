<template>
  <button 
    class="copy button" 
    :type="type" 
    :isSelected="isSelected"
    :aria-label="type === 'iconOnly' ? primaryIcon : null"
    @click="$emit('click')">

    <inline-svg v-if="primaryIconSrc" :src="primaryIconSrc" />
    <span v-if="type !== 'iconOnly'"><slot /></span>
    <inline-svg v-if="secondaryIconSrc && type !== 'iconOnly'" :src="secondaryIconSrc" />
  </button>
</template>

<script>
  export default {
    props: {
      type:           { type: String, default: 'tertiary', validator: val => [ 'tertiary', 'iconOnly' ].includes(val) },
      primaryIcon:    { default: null },
      secondaryIcon:  { default: null },
      isSelected:     { type: Boolean, default: false }
    },

    computed: {
      primaryIconSrc() {
        return this.primaryIcon && require(`../../assets/icons/icon-${this.primaryIcon}.svg`)
      },

      secondaryIconSrc() {
        return this.secondaryIcon && require(`../../assets/icons/icon-${this.secondaryIcon}.svg`)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .button {
    height: 2.5rem;
    display: inline-flex;
    align-items: center;
    border-radius: .5rem;
    padding: 0 .5rem;
    color: var(--color-content-secondary);
    transition-property: background-color, transform;
    transition-timing-function: ease;
    transition-duration: 150ms;
    border: none;
    background: transparent;
    cursor: pointer;
    user-select: none;

    &[type=iconOnly] {
      height: 2rem;
      width: 2rem;
      justify-content: center;
      padding: 0;

      svg {
        margin: 0!important;
        color: var(--color-content-secondary)!important
      }

      &:active {
        transform: scale(.88)!important
      }
    }

    svg {
      &:first-child { margin-right: .25rem }
      &:last-child { 
        margin-left: .25rem;
        color: var(--color-content-tertiary);
      }
    }

    &:hover, &[isSelected=true] {
      background-color: var(--color-bg-special-hover);
    }

    &[isSelected=true] {
      color: var(--color-content-primary)!important;
    }

    &:active {
      transform: scale(.95)
    }
  }
</style>