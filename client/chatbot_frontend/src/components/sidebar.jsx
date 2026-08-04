import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiSidebar  } from "react-icons/fi";
import { IoIosLogOut } from "react-icons/io";
import axios from 'axios'
import UserContext from '../context/UserContext'


const Sidebar = ({ isOpen , setIsOpen}) => {

    // Initialize all variables
    const {setUser} = useContext(UserContext)

    const navigate = useNavigate()

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
                <button className='p-2 font-bold' onClick={() => setIsOpen(!isOpen)}>
                    <FiSidebar size={24}/>
                </button>
            </div>

            {/*Logout button*/}
            <button className='absolute flex flex-row gap-2 items-center left-1/2 -translate-x-1/2 bottom-10' onClick={handleLogout}>
                <IoIosLogOut size={24}/> 
                <span className={`${isOpen?"visible":"hidden"}`}>Logout</span>
            </button>

        </div>
    )
}

export default Sidebar