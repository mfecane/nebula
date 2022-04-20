import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const app = initializeApp({
  apiKey: process.env.SHADER_GALLERY_API_KEY,
  authDomain: process.env.SHADER_GALLERY_AUTH_DOMAIN,
  projectId: process.env.SHADER_GALLERY_PROJECTID,
  storageBucket: process.env.SHADER_GALLERY_STORAGE_BUCKET,
  messagingSenderId: process.env.SHADER_GALLERY_MESSAGING_SENDER_ID,
  appId: process.env.SHADER_GALLERY_APP_ID,
})

export default app

export const auth = getAuth(app)
export const db = getFirestore(app)
