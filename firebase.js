// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.14.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword ,signOut} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-auth.js";
import { query, where, getFirestore, collection, addDoc, getDocs,onSnapshot,deleteDoc,doc,getDoc,updateDoc} from "https://www.gstatic.com/firebasejs/9.14.0/firebase-firestore.js"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD2h601M9xXW2cxWpQTFHSN430eGWc9btA",
  authDomain: "regiactapp.firebaseapp.com",
  projectId: "regiactapp",
  storageBucket: "regiactapp.appspot.com",
  messagingSenderId: "737339124671",
  appId: "1:737339124671:web:9c3d27506b32eb12e78f0a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth()
const db = getFirestore()

//controladores actividades

export const guardarActi = (objActividad) => addDoc(collection(db, 'actividades'),objActividad)
   
export const getActis = () => getDocs(collection(db,'actividades'))

export const onGetActis = (callback) => onSnapshot(collection(db,'actividades'),callback)

export const deleteActi = id => deleteDoc(doc(db,'actividades',id))

export const getActi =  id => getDoc(doc(db,'actividades',id))

export const editActi = (id, newFields) => updateDoc(doc(db,'actividades',id),newFields)

//controladores registro de horas

export const registrarHora = (objRegistro) => addDoc(collection(db, 'registros'),objRegistro)

export const onGetRegistros = (callback) => onSnapshot(collection(db,'registros'),callback)

export const getRegistroPorActividadId = (idActi) => getDoc(doc(db,'registros',idActi))

export const getRegistros = () => getDocs(collection(db,'registros'))



//controladores colaboradores

//export const saveUser = (nombre) => addDoc(collection(db, 'usuarios'),{nombre})
   
//export const getUsers = () => getDocs(collection(db,'usuarios'))

//export const onGetUsers = (callback) => onSnapshot(collection(db,'usuarios'),callback)

//export const deleteUser = id => deleteDoc(doc(db,'usuarios',id))

export const getUser =  id => getDoc(doc(db,'usuarios',id))

//export const editUser = (id, newFields) => updateDoc(doc(db,'usuarios',id),newFields)

//controladores sesiones usuarios

export const signUp = (email,pass) => {
  createUserWithEmailAndPassword(auth,email,pass)
  .then(userCredentials => {
    console.log('signup')
  })
}

export const signIn = (email,pass) => {
  signInWithEmailAndPassword(auth,email,pass)
  .then(userCredentials => {
    console.log('signin')
  })
}

export const logout = () => {
  signOut(auth)
}