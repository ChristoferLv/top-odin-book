import { useContext, useEffect, useState } from 'react'
import './App.css'
import { AuthContext } from './AuthContext'
import { Navigate, Outlet, useNavigate } from 'react-router'

function App() {
  const { user, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  if (isLoading) return <><p>Loading...</p></>;
  if (!user && !isLoading) return <Navigate to="/login" replace />

  return (
    <>
    <p>User:{user.id}</p>
      <Outlet />
    </>
  )
}

export default App
