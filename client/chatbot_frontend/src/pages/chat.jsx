import {useEffect, useState, useContext} from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import UserContext from '../context/UserContext'
import Sidebar from '../components/sidebar'
import MessageTextBox from '../components/messagetextbox'


const Chat = () => {
  // Initialize all variables
  const [userChatMessages, setUserChatMessages] = useState([])
  const [isOpen, setIsOpen] = useState(true)
  const {user, isLoading} = useContext(UserContext)

  const navigate = useNavigate()
  const location = useLocation()

  const chatId = location.pathname.split("/")[2]

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

  // Get all of the user's chat messages from the database
  useEffect(() => {
    const fetchAllChatMessages = async () => {
      try {
        // Put all of the chat messages in the 'userChatMessages' variable if successful
        const res = await axios.get(`http://localhost:8000/chats/messages/get/${chatId}`, { withCredentials: true })
        console.log(res.data)
        setUserChatMessages(res.data)

      } catch (error) {

        // If an error occured, just print it out for now  
        console.log("Failed to fetch chat messages: ", error.response?.data?.message || error.message)
      }
    }
    fetchAllChatMessages()
  }, [chatId])

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

        {/*Chat messages*/}
        <div className='flex flex-col mt-2 min-h-screen overflow-y-auto'>
          {userChatMessages.map((userChatMessage) => (
            <div key={userChatMessage.id}>
              <MessageTextBox message={userChatMessage.content} role={userChatMessage.role}></MessageTextBox>
            </div>
          ))}
        </div>

      </main>

    </div>
  )
}

export default Chat