import React from 'react'
import Login from './components/Login'
import Register from './components/Register'
import logo from '../../assets/logo_black.svg'
import './auth-page.scss'
import { FaLock } from 'react-icons/fa'
import {Route, Routes} from 'react-router-dom'

function AuthApp() {
    return (
        <div className={'auth-page'}>
            <div className={'auth-container'}>
            <div className={'auth-lock'}><FaLock/></div>
            <div className={'auth-logo'}><img src={logo} alt="logo"></img></div>
            <div className={'auth-form-container'}>
            <Routes>
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/*" element={<Login/>} />
            </Routes>
            </div>
            </div>
        </div>
    )
}

export default AuthApp
