import {useEffect, useState, useContext} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import UserContext from '../context/UserContext'
import Sidebar from '../components/sidebar'


const Home = () => {
  // Initialize all variables
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
    <div>
      Main
    </div>
  )
}


export default Home
