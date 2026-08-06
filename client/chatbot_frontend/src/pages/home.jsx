import {useEffect, useState, useContext} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { GoPlus } from "react-icons/go";
import axios from 'axios'
import UserContext from '../context/UserContext'
import Sidebar from '../components/sidebar'


const Home = () => {
  // Initialize all variables
  const [isOpen, setIsOpen] = useState(true)
  const [inputMessage, setInputMessage] = useState("")
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false)
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

  // Create a new chat, redirect the user to the page for the new chat, and then save and display the first user message and 
  // AI response
  const handleNewChatAndFirstMessage = async e => {
    e.preventDefault()

    // Set up the input to the chats/messages/add_user_question/:id route
    const userInput = {
        "content": inputMessage.trim()
    }

    try {
      // Throw an error if the user failed to enter in a question
      if (!inputMessage.trim()) {
          throw new Error("Please ask a question.")
      }
      setIsAddButtonDisabled(true)

      // Create a new chat
      const userChat = await axios.post(`http://localhost:8000/chats/add`, {}, { withCredentials: true })
      const userChatId = userChat.data.chatId

      // Add the user message to this new chat
      await axios.post(`http://localhost:8000/chats/messages/add_user_question/${userChatId}`, userInput, { withCredentials: true })

      // Add the AI response to this new chat too
      await axios.post(`http://localhost:8000/chats/messages/add_AI_response/${userChatId}`, {}, { withCredentials: true })

      // And finally send the user to that new chat page
      navigate(`/chat/${userChatId}`)

      // Clear the input box
      setInputMessage("")
    } catch (error) {

      // If an error occured, just print it out for now
      console.log("Failed to create a new chat: ", error.response?.data?.message || error.message)
    } finally {
      setIsAddButtonDisabled(false)
    }
  }

  // Display 'Loading...' instead of the main content while waiting to check if there is a user currently logged in 
  if (isLoading) return <div>Loading...</div>
  if (!user) return null

  return (
    <div className='flex bg-gray-100 min-h-screen'>

      {/*Sidebar*/}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen}/>
      
      <main className={`flex-1 ml-14 transition-all duration-200 flex flex-col min-h-screen ${isOpen ? 'lg:ml-64' : 'lg:ml-14'}`}> 
        
        {/*Header bar*/}
        <header className='bg-white sticky top-0 z-10 flex justify-end p-4 shadow'>
          <div className='bg-gray-300 w-10 h-10 rounded-full'></div>
        </header>


        {/*Add message input box and add button*/}
        <div className='flex-1 flex items-center justify-center'>
          <div className='bg-white flex flex-col p-4 rounded-xl max-w-3xl w-full mx-auto'>
            <textarea
              name="userMessage"
              id="userMessage"
              placeholder="Ask Anything"
              rows={1}
              className='flex-1 field-sizing-content resize-none p-2 outline-none focus:outline-none max-h-40 overflow-y-auto'
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isAddButtonDisabled}
            />
            <button className='flex justify-start cursor-pointer' onClick={handleNewChatAndFirstMessage} disabled={isAddButtonDisabled}><GoPlus size={24}/></button>
          </div>
        </div>

      </main>

    </div>
  )
}


export default Home
