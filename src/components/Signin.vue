<template>
  <div class="signin">
    <div>
      <h1>flowtimr</h1>
      <button @click="$emit('signin-button-click')" aria-label="Sign in with Microsoft">
        <img src="@/assets/ms-signin-button.svg" aria-hidden="true">
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .signin {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    user-select: none;

    h1 {
      margin-bottom: 1.5rem;
    }

    button {
      margin: 0 auto;
      appearance: none;
      border: none;
      // outline: none;
      padding: 0;
      margin: 0;
      cursor: pointer;
      transition: opacity 150ms ease;

      &:hover {
        opacity: .66;
      }

      img {
        display: block;
      }
    }
  }
</style>