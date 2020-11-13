<template>
  <div class="badge copy isUppercase" :type="type">
    <slot />
  </div>
</template>

<script>
  export default {
    props: {
      type: { type: String, default: 'default', validator: val => [ 'default', 'active' ].includes(val) }
    }
  }
</script>

<style lang="scss" scoped>
  .badge {
    border-radius: 999px;
    display: table;
    position: relative;

    &::after {
      content: "";
      width: 100%;
      display: block;
      height: 2px;
      margin-top: 2px;
      left: 0;
      
      border-radius: 1px;
      transition: opacity 150ms ease;
    }

    &[type=default] {
      color: var(--color-content-secondary);

      &::after {
        display: none;
      }
    } 

    &[type=active] {
      color: var(--color-brand-primary);

      &::after {
        background-color: var(--color-brand-secondary);
      }
    } 
  }
</style>