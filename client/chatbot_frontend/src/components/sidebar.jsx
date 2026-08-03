import React from 'react'
import { FiSidebar  } from "react-icons/fi";

const Sidebar = ({ isOpen , setIsOpen}) => {
    return (
        <div className={`fixed bg-white min-h-screen transition-all duration-200 shadow ${isOpen?"w-64":"w-16"}`}>
            <div className='p-4 flex justify-between items-center shadow'>
                <div className={`text-xl font-bold ${isOpen?"visible":"hidden"}`}>Chatbot-Clone</div>
                <button className='p-2 font-bold'onClick={() => setIsOpen(!isOpen)}>
                    <FiSidebar size={24}/>
                </button>
            </div>
        </div>
    )
}

export default Sidebar