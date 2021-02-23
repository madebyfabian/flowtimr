<template>
  <div class="signin">
    <div>
      <h1>flowtimr</h1>
      <button @click="startAuth" aria-label="Sign in with Microsoft">
        <img src="@/assets/ms-signin-button.svg" aria-hidden="true">
      </button>
    </div>
  </div>
</template>

<script>
	import { store } from '@/store'
  import firebase from '@/services/firebase'

	export default {
		computed: {
      APIService: () => store.APIService
		},

    methods: {
      async startAuth() {
        console.log('Starting auth...')

        const provider = new firebase.auth.OAuthProvider('microsoft.com')
        provider.setCustomParameters({ prompt: 'consent',  })
        provider.addScope('calendars.read')
        provider.addScope('offline_access')

        try {
          const res = await firebase.auth().signInWithRedirect(provider)
          console.log({ res })
        } catch (error) {
          console.error(error)
        }
      }
    }
	}
</script>

<style lang="scss" scoped>
  .signin {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    user-select: none;
		padding: 1.5rem;

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