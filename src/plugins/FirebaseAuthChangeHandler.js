import { store, mutations } from '@/store'
import firebase from '@/services/firebase'
import router from '@/router'


export default {
	install: ( app, options ) => {
		firebase.auth().onAuthStateChanged(authUser => {
			let redirect = false
			
			if (authUser && !store.user) 
				redirect = { name: 'MainView' }
			
			if (!authUser && store.user)
				redirect = { name: 'AuthView' }	

			const newUser = authUser ? authUser.toJSON() : null

			// Update user, at least if not the old AND the new value is "null"
			if (!(newUser === null && store.user === null)) 
				mutations.updateUser(newUser)
			
			if (redirect) 
				router.push(redirect)
		})
	}
}