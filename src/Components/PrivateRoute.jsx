import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import useAuthStatus from '../Hooks/useAuthStatus'
import Loading from './Loading'


const PrivateRoute = () => {
    const { loggedIn, checkingStatus } = useAuthStatus()

    if(checkingStatus) {
        return <Loading />
    }

    return loggedIn ? <Outlet /> : <Navigate to='/sign-in' />
}

export default PrivateRoute