import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';
import LoginPage from './LoginPage.jsx';
import { AuthProvider } from './AuthProvider.jsx'
import MainPage from './MainPage.jsx';
import RegisterPage from './RegisterPage.jsx';
import MyPage from './MyPage.jsx';
import PostsList from './components/PostsList.jsx';
import ContentPane from './components/ContentPane.jsx';
import BookmarksPage from './BookmarksPage.jsx';
import EditProfile from './components/EditProfile.jsx';


const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  {
    path: "/",
    element: <MainPage />,
    children: [
      { path: "/settings/profile", element: <EditProfile /> },
      { path: "/:username/*", element: <MyPage /> },
      { path: "/bookmarks", element: <BookmarksPage /> },
      { path: "/", element: <ContentPane /> },
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
