import admin from 'firebase-admin'
import firebaseConfig  from './firebaseConfig.js'

try {
  admin.initializeApp({
    credential: admin.credential.cert(
        firebaseConfig
    ),
    storageBucket: "instaconnect-3b72c.appspot.com"
  })
  console.log('Initialized.')
} catch (error) {
  /*
   * We skip the "already exists" message which is
   * not an actual error when we're hot-reloading.
   */
  if (!(/already exists/.test(error.message))) {
    console.error('Firebase admin initialization error', error.stack)
  }
}

export default admin