import { db } from 'ts/firebase'
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
} from 'firebase/firestore'
import { ShaderState, UserState } from 'ts/hooks/use-store'
import Shader from 'ts/components/shader-editor/shader'

const readUser = async (currentUser: UserState): Promise<UserState> => {
  const docSnap = await getDoc(doc(db, 'users', currentUser.uid))
  if (!docSnap.exists()) {
    return null
  }

  const data = docSnap.data()
  const user = { ...currentUser, name: data.name }
  return user
}

const readShaders = async (): Promise<ShaderState[]> => {
  const q1 = query(collection(db, 'shaders'))
  const shaders: ShaderState[] = []
  const query1Snapshot = await getDocs(q1)
  query1Snapshot.forEach((doc) => {
    shaders.push({ ...(doc.data() as ShaderState), id: doc.id })
  })

  const q2 = query(collection(db, 'users'))
  const users: UserState[] = []
  const query2Snapshot = await getDocs(q2)
  query2Snapshot.forEach((doc) => {
    users.push({ ...(doc.data() as UserState), uid: doc.id })
  })

  shaders.forEach((sh) => {
    const user = users.find((u) => u.uid === sh.user)
    if (!user) sh.error = true
    sh.user = user || null
  })

  return shaders
}

const saveShader = async (
  shader: ShaderState,
  currentUser: UserState
): Promise<void> => {
  const data = { code: shader.code, user: currentUser.uid }
  await setDoc(doc(db, 'shaders', shader.id), data)
}

const saveUser = async (currentUser: UserState): Promise<void> => {
  const data = {
    name: currentUser.name,
  }
  await setDoc(doc(db, 'users', currentUser.uid), data)
}

const createShader = async (
  name: string,
  currentUser: UserState
): Promise<ShaderState> => {
  if (!currentUser) {
    throw new Error('No user')
  }

  const shader = {
    name: name,
    user: currentUser.uid,
    code: `
vec4 getColor(vec2 inuv) {
return vec4(vec3(0.5 + inuv.x * 0.5, 0.5 + inuv.y * 0.5, 0.0), 1.0);
}`.trim(),
  }

  const docRef = await addDoc(collection(db, 'shaders'), shader)

  return { ...shader, id: docRef.id }
}

const forkShader = async (
  currentShader: ShaderState,
  currentUser: UserState
): Promise<ShaderState> => {
  if (currentShader.user.uid === currentUser.uid) {
    throw new Error('Wrong shader user')
  }

  let shader: ShaderState = {
    name: `${currentShader.name} (forked by ${currentUser.name})`,
    code: currentShader.code,
    user: currentUser.uid,
  }

  const docRef = await addDoc(collection(db, 'shaders'), shader)
  const id = docRef.id
  shader = { ...shader, id }

  return shader
}

const firestore = {
  readUser,
  readShaders,
  saveShader,
  createShader,
  saveUser,
  forkShader,
}

export default firestore
