<template>
  <button @click="$emit('click')">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
      <path fill="#404040" d="M12 13.172l4.95-4.95 1.414 1.414L12 16 5.636 9.636 7.05 8.222l4.95 4.95z"/>
    </svg>
  </button>
</template>

<style lang="scss" scoped>
  button {
    height: 2.5rem;
    width: 2.5rem;
    border-radius: 2.5rem;
    box-shadow: inset 0 0 0 4px var(--color-bg-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    background: transparent;
    outline: none;
    border-style: none;
    cursor: pointer;
  }
</style>