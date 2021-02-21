<template>
  <div id="app" v-focus-visible>
    <router-view />
  </div>
</template>

<script>
  import '@/scss/main.scss'
  
  export default {
    name: 'App'
  }
</script>