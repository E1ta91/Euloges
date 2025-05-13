import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage from './pages/landingPage'
import MainPage from './pages/mainpage'
import ChatApp from './components/chatApp'
import Profile from './pages/profile'
import { UserProvider } from './context/UserContext'
import UserProfile from './pages/userProfile'
import Following from './pages/following'
import Followers from './pages/followers'


function App() {
 const router = createBrowserRouter([

  {
    path: '/',
    element: <LandingPage/>
  },
  {
    path: 'main/:postId',
    element: <MainPage/>
  },
  {
    path: 'main',
    element: < MainPage/>
    
  },
 
  {
   path: 'chat',
   element: <ChatApp/> 
  },
  {
   path: 'profile',
   element: <Profile/> 
  },
  {
   path: 'profile/:id',
   element: <UserProfile/> 
  },
 {
  path: 'following',
  element: <Following/>
 },
 {
  path: 'followers',
  element: <Followers/>
 }
 
 
   
 ])

  return (
    <UserProvider>
      <div className='font-sans'>
        <RouterProvider router={router} />
      </div>
    </UserProvider>
  )
}

export default App
