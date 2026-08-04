import {useEffect, useState, useContext} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import UserContext from '../context/UserContext'
import Sidebar from '../components/sidebar'


const Home = () => {
  // Initialize all variables
  const [isOpen, setIsOpen] = useState(true)
  const {user, isLoading} = useContext(UserContext)

  const navigate = useNavigate()

  // Activates when 'user' or 'isLoading' changes
  useEffect(() => {
    // If there is no user logged in after checking, redirect to the login page
    if(!isLoading && !user) {
      navigate("/auth/login")
    }
    else {
      console.log(user)
    }
  }, [user, isLoading])

  // Display 'Loading...' instead of the main content while waiting to check if there is a user currently logged in 
  if (isLoading) return <div>Loading...</div>
  if (!user) return null

  return (
    <div className='flex bg-gray-100 min-h-screen'>

      {/*Sidebar*/}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
      
      <main className={`flex-1 ml-14 transition-all duration-200 ${isOpen ? 'lg:ml-64' : 'lg:ml-14'}`}> 
        
        {/*Header bar*/}
        <header className='bg-white sticky top-0 z-10 flex justify-end p-4 shadow'>
          <div className='bg-gray-300 w-10 h-10 rounded-full'></div>
        </header>

      </main>

    </div>
  )
}


export default Home
