<template>
  <div class="loadingSpinner">
    <div class="loadingSpinner-item" />
  </div>
</template>

<style lang="scss" scoped>
  .loadingSpinner {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .loadingSpinner-item {
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    border: 4px solid var(--color-content-tertiary);
    border-top: 4px solid var(--color-content-secondary);
    border-left: 4px solid var(--color-content-secondary);
    border-radius: 100%;
    transition-property: transform;
    animation: rotate 600ms linear infinite;
  }

  @keyframes rotate {
    from { transform: rotate(0deg) }
    to { transform: rotate(360deg) }
  }
</style>