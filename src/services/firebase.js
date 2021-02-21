import firebase from 'firebase/app'
import 'firebase/auth'


const config = {
	apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
	authDomain: process.env.VUE_APP_FIREBASE_AUTH_DOMAIN,
	projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
	appId: process.env.VUE_APP_FIREBASE_APP_ID
}

if (!firebase.apps.length)
	firebase.initializeApp(config)

firebase.auth().useDeviceLanguage()
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)


export default firebase