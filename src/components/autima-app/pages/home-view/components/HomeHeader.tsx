import { getAuth } from 'firebase-admin/auth'
import style from './header.module.scss'
import { useEffect, useState } from 'react'
import { app, auth } from '../../../../../App'
import { getFunctions, httpsCallable } from 'firebase/functions'
import { getIdToken, getIdTokenResult } from 'firebase/auth'
import React from 'react'


function HomeHeader() {
   
    return (
        <div>
            <div className={style.managerHomeHeader}>
                <div className={style.managerHomeHeaderContainer}>
                    <h1 className={style.testClass}>Welcome to Autima!</h1>
                    <h2>Our app is currently under developement...</h2>
                </div>
            </div>
        </div>
    )
}

export default HomeHeader

