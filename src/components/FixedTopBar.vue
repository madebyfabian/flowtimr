<template>
  <transition name="slide-fade">
    <div v-if="isShown" class="FixedTopBar copy">
      Was steht noch an?
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      isShown: { type: Boolean, required: true }
    }
  }
</script>

<style lang="scss" scoped>
  .FixedTopBar {
    height: 2.5rem;
    width: calc(100% - 1rem);
    margin: 0 .5rem;
    border-radius: 0 0 .75rem .75rem;
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    color: var(--color-content-secondary);
    background-color: var(--color-bg-tertiary);
  }

  /**
   * Transitions
   */
  .slide-fade-enter-active, .slide-fade-leave-active {
    transition: all 300ms ease;
  }

  .slide-fade-enter, .slide-fade-leave-to {
    opacity: 0;
    transform: translateY(-50%);
  }
</style>