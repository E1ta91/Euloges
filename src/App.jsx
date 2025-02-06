
import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LandingPage from './pages/landingPage'
import MainPage from './pages/mainpage'








function App() {
 const router = createBrowserRouter([

  {
    path: '/',
    element: <LandingPage/>
  },
  {
    path: 'main',
    element: < MainPage/>
    
  },
  {
   
    
  },
  {
   
    
  },
 
 
  
 
  

  
 ])

  return (
    <RouterProvider router={router} />
  )
}

export default App
