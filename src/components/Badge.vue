<template>
  <div class="badge copy isUppercase" :type="type">
    <slot />
  </div>
</template>

<script>
  export default {
    props: {
      type: { type: String, default: 'default', validator: val => [ 'default', 'blue' ].includes(val) }
    }
  }
</script>

<style lang="scss" scoped>
  .badge {
    padding: 4px 12px;
    border-radius: 999px;
    display: table;
    

    &[type=default] {
      color: var(--color-content-secondary);
      background: var(--color-bg-secondary)
    } 

    &[type=blue] {
      color: var(--color-brand-primary);
      background: var(--color-brand-secondary);
    } 
  }
</style>