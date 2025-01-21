import React from 'react';
import {useSelector} from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'
import { AppState } from '../redux/store';

export default function PrivateRoute() {
    const {currentUser} = useSelector((state: AppState) => state.user)
  return currentUser ? <Outlet/> : <Navigate to='/sign-in'/>
}
