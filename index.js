import {signUp,deleteUser,onGetUsers,saveUser,guardarActi,getActis,onGetActis,deleteActi,getActi,editActi} from './firebase.js'

const actiForm = document.getElementById('form-actividad')
const actiLista = document.getElementById('lista-actividades')
const usrForm = document.getElementById('form-usuario')
const usrLista = document.getElementById('lista-usuarios')
let editStatus = false
let id = ''


window.addEventListener('DOMContentLoaded', async() => {
    onGetActis((querySnapshot) => {
        actiLista.innerHTML = ''
        querySnapshot.forEach(doc => {
            const actividad = doc.data()
            
            actiLista.innerHTML += `
            <div class="card card-body mt-2 border-primary">
                <h3 class="h5">${actividad.nombre}</h3>
                <div>
                    <button class="btn btn-primary btn-eliminar" data-id="${doc.id}">Eliminar</button>
                    <button class="btn btn-secondary btn-editar" data-id="${doc.id}">Editar</button>
                </div>
            </div>
            `
        })
        
        const btnsEliminar = actiLista.querySelectorAll('.btn-eliminar')

        btnsEliminar.forEach(btn => {
            btn.addEventListener('click', ({target: {dataset}}) => {
                deleteActi(dataset.id)
            })
        })
        
        const btnsEditar = actiLista.querySelectorAll('.btn-editar')

        btnsEditar.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                
                const doc = await getActi(e.target.dataset.id)
                const nombreActi = doc.data()

                actiForm['nombreAct'].value = nombreActi.nombre
                id = doc.id

                editStatus = true
                
                actiForm['btn-guardar-act'].innerText = 'Editar'
            })
        })
    })

    onGetUsers((querySnapshot) => {
        usrLista.innerHTML = ''
        querySnapshot.forEach(doc => {
            const usuario = doc.data()
            
            usrLista.innerHTML += `
            <div class="card card-body mt-2 border-primary">
                <h3 class="h5">${usuario.nombre}</h3>
                <div>
                    <button class="btn btn-primary btn-eliminarUsr" data-id="${doc.id}">Eliminar</button>
                    <button class="btn btn-secondary btn-editarUsr" data-id="${doc.id}">Editar</button>
                </div>
            </div>
            `
        })

        const btnsEliminar = usrLista.querySelectorAll('.btn-eliminarUsr')

        btnsEliminar.forEach(btn => {
            btn.addEventListener('click', ({target: {dataset}}) => {
                deleteUser(dataset.id)
            })
        })
    })
})

actiForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const nombre = actiForm['nombreAct'].value

    if(!editStatus){
        guardarActi(nombre)
    }else{
        editActi(id,{nombre})

        editStatus = false
    }

    actiForm.reset()
})

usrForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const nombre = usrForm['nombreUsr'].value

    saveUser(nombre)

    usrForm.reset()
})

signupForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = signupForm['signup-email'].value
    const pass = signupForm['signup-pass'].value

    signUp(email,pass)
    $('#signupModal').modal('hide')
    signupForm.reset()
})