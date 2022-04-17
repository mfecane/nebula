import { initializeApp } from 'firebase/app'
import 'firebase/auth'

const app = initializeApp({
  apiKey: process.env.SHADER_GALLERY_API_KEY,
  authDomain: process.env.SHADER_GALLERY_AUTH_DOMAIN,
  projectId: process.env.SHADER_GALLERY_PROJECTID,
  storageBucket: process.env.SHADER_GALLERY_STORAGE_BUCKET,
  messagingSenderId: process.env.SHADER_GALLERY_MESSAGING_SENDER_ID,
  appId: process.env.SHADER_GALLERY_APP_ID,
})

export const auth = app.auth()
export default app
