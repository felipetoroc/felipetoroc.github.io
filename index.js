import {getRegistros,getUser,onGetRegistros,registrarHora,auth,logout,signIn,guardarActi,getActis,onGetActis,deleteActi,getActi,editActi} from './firebase.js'
import {cantidadHoras} from './functions.js'

const actiForm = document.getElementById('form-actividad')
const actiLista = document.getElementById('lista-actividades')
const regiLista = document.getElementById('listaRegistros')
const regHorasForm = document.getElementById('regHorasForm')
const navTabHeader = document.getElementById('v-pills-tab')
const navTabContent = document.getElementById('v-pills-tabContent')
const spanUserNameGlobal = document.getElementById('userNameGlobal')
const dropdownActividades = document.getElementById('dropdownActividades')
const usrForm = document.getElementById('form-usuario')
const usrLista = document.getElementById('lista-usuarios')
let editStatus = false
let idActi = ''
let userId = ''
let selectedActi = ''

const loggedInLinks = document.querySelectorAll('.login')
const loggedOutLinks = document.querySelectorAll('.logout')

auth.onAuthStateChanged(async (user) => {
    let nombreUsuario = ''
    if(user){
        userId = user.uid
        nombreUsuario = await getUser(user.uid)
        loggedOutLinks.forEach(link => link.style.display = 'none')
        loggedInLinks.forEach(link => link.style.display = 'block')
    }else{
        nombreUsuario = ''
        loggedOutLinks.forEach(link => link.style.display = 'block')
        loggedInLinks.forEach(link => link.style.display = 'none')
    }
    spanUserNameGlobal.innerHTML = `${nombreUsuario.data().nombre}` 
})

window.addEventListener('DOMContentLoaded', async() => {
    
    onGetActis((querySnapshot) => {
        navTabHeader.innerHTML = ''
        navTabContent.innerHTML = ''
        querySnapshot.forEach(async (doc) => {
            const actividad = doc.data()
            let nombre = actividad.nombre.replace(/\s/g,'')
            
            if(doc.data().estado === true){
                navTabHeader.innerHTML += `
                <li>
                    <a class="nav-link dropdown-item text-start link-selected-acti" data-id=${doc.id} id="${nombre}-tab" data-bs-toggle="pill" data-bs-target="#${nombre}" type="button" role="tab" aria-controls="${nombre}">
                        ${actividad.nombre}
                    </a>
                </li>
                `
                navTabContent.innerHTML += `
                <div class="tab-pane fade" id="${nombre}" role="tabpanel" aria-labelledby="${nombre}-tab" tabindex="0">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-12">
                                <h5 class="card-title">${actividad.nombre}</h5>
                                <p class="card-text">Horas totales: ${actividad.horas}</p>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-md-12">
                                <button class="btn btn-primary btn-eliminar" data-id="${doc.id}">Eliminar</button>
                                <button class="btn btn-secondary btn-editar" data-id="${doc.id}">Editar</button>
                                <button class="btn btn-success btn-reg-hora" data-id="${doc.id}" data-bs-toggle="modal" data-bs-target="#regHorasModal">Registrar horas</button>
                            </div>
                        </div>
                    </div>
                </div>
                `
            }
            
        })

        const btnsRegHora = actiLista.querySelectorAll('.btn-reg-hora')

        btnsRegHora.forEach(btn => {
            btn.addEventListener('click', ({target: {dataset}}) => {
                idActi = dataset.id
            })
        })

        const btnsEliminar = actiLista.querySelectorAll('.btn-eliminar')

        btnsEliminar.forEach(btn => {
            btn.addEventListener('click', ({target: {dataset}}) => {
                editActi(dataset.id,{estado:false})
            })
        })
        
        const btnsEditar = actiLista.querySelectorAll('.btn-editar')

        btnsEditar.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                
                const doc = await getActi(e.target.dataset.id)
                const nombreActi = doc.data()
                
                actiForm['nombreAct'].value = nombreActi.nombre
                idActi = doc.id

                editStatus = true
                
                actiForm['btn-guardar-act'].innerText = 'Editar'
            })
        })

        const linksSelectedActi = actiLista.querySelectorAll('.link-selected-acti')
        
        linksSelectedActi.forEach(link => {
            link.addEventListener('click',({target:{dataset}}) =>{
               
                poblarRegistros(dataset.id)
            })
        })

    })

    

    
    // onGetUsers((querySnapshot) => {
    //     usrLista.innerHTML = ''
    //     querySnapshot.forEach(doc => {
    //         const usuario = doc.data()
            
    //         usrLista.innerHTML += `
    //         <div class="card card-body mt-2 border-primary">
    //             <h3 class="h5">${usuario.nombre}</h3>
    //             <div>
    //                 <button class="btn btn-primary btn-eliminarUsr" data-id="${doc.id}">Eliminar</button>
    //                 <button class="btn btn-secondary btn-editarUsr" data-id="${doc.id}">Editar</button>
    //             </div>
    //         </div>
    //         `
    //     })

    //     const btnsEliminar = usrLista.querySelectorAll('.btn-eliminarUsr')

    //     btnsEliminar.forEach(btn => {
    //         btn.addEventListener('click', ({target: {dataset}}) => {
    //             deleteUser(dataset.id)
    //         })
    //     })
    // })
})

actiForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const nombre = actiForm['nombreAct'].value
    const horas = actiForm['horasTotales'].value
    const tipo = actiForm['tipoActividad'].value

    if(!editStatus){
        if(tipo != 'Seleccione tipo'){
            guardarActi({nombre,horas,estado:true,tipo})
        }else{
            $('#faltaTipoAlerta').show()
        }
        
    }else{
        editActi(idActi,{nombre,horas})

        editStatus = false
    }

    actiForm.reset()
})

regHorasForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const fechaIni = regHorasForm['fechaIni'].value
    const fechaFin = regHorasForm['fechaFin'].value
    
    registrarHora({fechaIni,fechaFin,idActi,userId})
    
    regHorasForm.reset()

    $('#regHorasModal').modal('hide')
    
    poblarRegistros(idActi)
})


// usrForm.addEventListener('submit', (e) => {
//     e.preventDefault()

//     const nombre = usrForm['nombreUsr'].value

//     saveUser(nombre)

//     usrForm.reset()
// })

//signupForm.addEventListener('submit', (e) => {
  //  e.preventDefault()

    //const email = signupForm['signup-email'].value
    //const pass = signupForm['signup-pass'].value

//    signUp(email,pass)
  //  $('#signupModal').modal('hide')
   // signupForm.reset()
//})

signinForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = signinForm['signin-email'].value
    const pass = signinForm['signin-pass'].value

    signIn(email,pass)
    $('#signinModal').modal('hide')
    signinForm.reset()
})

btnLogout.addEventListener('click', (e) =>{
    e.preventDefault()
    logout()
})

function poblarRegistros(actiId){
    regiLista.innerHTML = ''
    onGetRegistros((querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
            if(actiId === doc.data().idActi){
                const registro = doc.data()
                const actividad = await getActi(registro.idActi)
                const usuario = await getUser(registro.userId)
                const horas = cantidadHoras(new Date(registro.fechaIni), new Date(registro.fechaFin))
                regiLista.innerHTML += `
                    <tr>
                        <td>${registro.fechaIni}</td>
                        <td>${registro.fechaFin}</td>
                        <td>${actividad.data().nombre}</td>
                        <td>${usuario.data().nombre}</td>
                        <td>${horas}</td>
                    </tr>
                `
            }
        })
    })
    
}