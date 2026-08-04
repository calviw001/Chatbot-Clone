import { useEffect, useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiSidebar  } from "react-icons/fi"
import { IoIosLogOut } from "react-icons/io"
import { BsThreeDotsVertical } from "react-icons/bs"
import { CiCirclePlus } from "react-icons/ci";
import axios from 'axios'
import UserContext from '../context/UserContext'


const Sidebar = ({ isOpen , setIsOpen}) => {

    // Initialize all variables
    const [userChats, setUserChats] = useState([])
    const {setUser} = useContext(UserContext)

    const navigate = useNavigate()

    // Get all of the user's chats from the database
    useEffect(() => {
        const fetchAllChats = async () => {
            try {
                // Put all of the chats in the 'userChats' variable if successful
                const res = await axios.get("http://localhost:8000/chats/get", { withCredentials: true })
                setUserChats(res.data)

            } catch (error) {

                // If an error occured, just print it out for now  
                console.log("Failed to fetch chats: ", error.response?.data?.message || error.message)
            }
        }
        fetchAllChats()
    }, [])

    // Logout button functionality
    const handleLogout = async e => {
        e.preventDefault()

        try {
            // Attempt to logout the user
            await axios.post("http://localhost:8000/auth/logout", {}, { withCredentials: true })

            // If successful, update the user data to show that the user is no longer logged in and redirect back to the login page
            setUser(null)
            navigate("/auth/login")
        } catch (error) {

            // If an error occured, just print it out for now
            console.log("Failed to logout: ", error.response?.data?.message || error.message)
        }
    }


    return (
        <div className={`fixed bg-white min-h-screen transition-all duration-200 shadow ${isOpen?"w-64":"w-16"}`}>

            {/*Title and sidebar button*/}
            <div className='p-4 flex justify-between items-center shadow'>
                <div className={`text-xl font-bold ${isOpen?"visible":"hidden"}`}>Chatbot-Clone</div>
                <button className='p-2 font-bold cursor-pointer' onClick={() => setIsOpen(!isOpen)}>
                    <FiSidebar size={24}/>
                </button>
            </div>

            {/*New chat button*/}
            <button className='absolute flex flex-row gap-2 items-center left-1/2 -translate-x-1/2 mt-4 cursor-pointer' onClick={() => navigate('/')}>
                <CiCirclePlus size={24}/> 
                <span className={`font-bold ${isOpen?"visible":"hidden"}`}>New Chat</span>
            </button>

            {/*User chats*/}
            <div className={`flex flex-col mt-10 ${isOpen?"visible":"hidden"}`}>
                <span className='ml-4 mt-4 font-bold'>Recent Chats:</span>
                <div className='flex flex-col gap-2 py-3 px-3 h-120 overflow-y-auto'>
                    {userChats.map((userChat) => (
                        <div 
                            key={userChat.id} 
                            className='flex flex-row justify-between w-full p-2 rounded hover:bg-gray-100 cursor-pointer truncate'
                            onClick={() => navigate(`/chat/${userChat.id}`)}
                        >
                            <h1>{userChat.title}</h1>
                            <button className='rounded hover:bg-gray-300 cursor-pointer'>
                                <BsThreeDotsVertical />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/*Logout button*/}
            <button className='absolute flex flex-row gap-2 items-center left-1/2 -translate-x-1/2 bottom-10 cursor-pointer' onClick={handleLogout}>
                <IoIosLogOut size={24}/> 
                <span className={`font-bold ${isOpen?"visible":"hidden"}`}>Logout</span>
            </button>

        </div>
    )
}

export default Sidebar