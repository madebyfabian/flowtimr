<template>
  <transition name="slide-fade">
    <div class="modalWindow" v-if="isOpened">
      <FocusLock>
        <div class="modal">
          <Button type="iconOnly" primaryIcon="close" @click="$emit('close')" />
          
          <slot />
        </div>
      </FocusLock>
    </div>
  </transition>
</template>

<script>
  import FocusLock from 'vue-focus-lock'
  import { Button } from '@/components/ui'

  export default {
    components: { FocusLock, Button },

    props: {
      isOpened: { type: Boolean, required: true }
    }
  }
</script>

<style lang="scss" scoped>
  .slide-fade-enter-active, .slide-fade-leave-active {
    transition: all 150ms ease;

    .modal {
      transition: all 150ms ease;
    }
  }

  .slide-fade-enter, .slide-fade-leave-to {
    opacity: 0;

    .modal {
      transform: translateY(10vh);
    }
  }

  .modalWindow {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .75);
    z-index: 1000;
    display: flex;
    align-items: flex-end;
    justify-content: center;

    > div, > div > div {
      width: 100%;
    }

    .modal {
      border-radius: 2rem 2rem 0 0;
      width: 100%;
      background: var(--color-bg-secondary);
      padding: 1.5rem;
      position: relative;

      .button {
        position: absolute;
        right: 1.25rem;
        top: 1.25rem;
      }
    }
  }
</style>