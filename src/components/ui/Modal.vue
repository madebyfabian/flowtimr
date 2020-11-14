<template>
  <transition name="slide-fade">
    <div class="modalWindow" v-if="isOpened">
      <FocusTrap v-model="isOpened">
        <div class="modal">
          <Button type="iconOnly" primaryIcon="close" @click="$emit('close')" />
          
          <slot />
        </div>
      </FocusTrap>
    </div>
  </transition>
</template>

<script>
  import { Button } from '@/components/ui'

  export default {
    components: { Button },

    props: {
      isOpened: { type: Boolean, required: true }
    }
  }
</script>

<style lang="scss" scoped>
  .slide-fade-enter-from, 
  .slide-fade-leave-to {
    opacity: 0;

    .modal {
      transform: translateY(10vh);
    }
  }

  .slide-fade-enter-active, 
  .slide-fade-leave-active {
    transition: all 150ms ease;

    .modal {
      transition: all 150ms ease;
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