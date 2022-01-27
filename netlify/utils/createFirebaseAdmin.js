const admin = require('firebase-admin')


module.exports = () => {
  const configJSON = JSON.parse(process.env.FIREBASE_CONFIG)
  const adminConfig = { credential: admin.credential.cert(configJSON) }

  if (!admin.apps.length)
    admin.initializeApp(adminConfig)

  return admin
}