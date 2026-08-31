import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
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
import PostPage from './PostPage.jsx';
import UsersPage from './UsersPage.jsx';
import SeeingPicturePage from './SeeingPicturePage.jsx';
import SearchPane from './components/SearchPane.jsx';
import NotificationsPane from './components/NotificationsPane.jsx';


const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/:username/post/:postId/photo", element: <SeeingPicturePage /> },
  {
    path: "/",
    element: <MainPage />,
    children: [
      { path: "/notifications", element: <NotificationsPane/> },
      { path: "/search", element: <SearchPane /> },
      { path: "/users", element: <UsersPage /> },
      { path: "/settings/profile", element: <EditProfile /> },
      { path: "/bookmarks", element: <BookmarksPage /> },
      { path: "/:username/post/:postId/photo", element: <SeeingPicturePage /> },
      { path: "/:username/post/:postId", element: <PostPage /> },
      { path: "/:username/replies", element: <MyPage /> },
      { path: "/:username/shares", element: <MyPage /> },
      { path: "/:username/likes", element: <MyPage /> },
      { path: "/:username", element: <MyPage /> },
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
