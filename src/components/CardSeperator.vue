<template functional>
  <div class="cardSeperator copy">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
  .cardSeperator {
    text-align: center;
    margin: 2rem 0 .5rem;
    color: var(--color-content-secondary);
  }
</style>