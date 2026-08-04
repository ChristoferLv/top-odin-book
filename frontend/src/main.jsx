import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';
import LoginPage from './LoginPage.jsx';
import { AuthProvider } from './AuthProvider.jsx'
import MainPage from './MainPage.jsx';
import RegisterPage from './RegisterPage.jsx';


const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <MainPage /> },
      { path: "*", element: <Navigate to="/" replace /> }
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
