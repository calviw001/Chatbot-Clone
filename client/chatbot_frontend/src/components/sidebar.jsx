import { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiSidebar } from "react-icons/fi";
import { IoIosLogOut } from "react-icons/io";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiCirclePlus } from "react-icons/ci";
import { GoTrash } from "react-icons/go";
import axios from "axios";
import UserContext from "../context/UserContext";
import { toast, Bounce } from 'react-toastify';

const Sidebar = ({ isOpen, setIsOpen, isProcessing }) => {
  // Initialize all variables
  const [userChats, setUserChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const { setUser } = useContext(UserContext);

  const navigate = useNavigate();
  const location = useLocation();

  const chatId = location.pathname.split("/")[2];

  // Get all of the user's chats from the database
  useEffect(() => {
    const fetchAllChats = async () => {
      try {
        // Put all of the chats in the 'userChats' variable if successful
        const res = await axios.get("http://localhost:8000/chats/get", {
          withCredentials: true,
        });
        setUserChats(res.data);
      } catch (error) {
        // If an error occured, display a popup with an error message
        const errorMessage = error.response?.data?.message || error.message;
        const notify = () => toast.error(`Failed to fetch chats: ${errorMessage}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        notify();
      }
    };
    fetchAllChats();
  }, []);

  // Logout button functionality
  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      // Attempt to logout the user
      await axios.post(
        "http://localhost:8000/auth/logout",
        {},
        { withCredentials: true },
      );

      // If successful, update the user data to show that the user is no longer logged in and redirect back to the login page
      setUser(null);
      navigate("/auth/login");
    } catch (error) {
      // If an error occured, display a popup with an error message
      const errorMessage = error.response?.data?.message || error.message;
      const notify = () => toast.error(`Failed to logout: ${errorMessage}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      notify();
    }
  };

  // Opening a chat's context menu functionality
  const handleOpeningContextMenu = async (e, currentChatId) => {
    // Prevent triggering the event of also navigating to the chat's page too
    e.stopPropagation();

    // If this chat's context menu is already open, close it.
    if (selectedChat === currentChatId) {
      setSelectedChat(null);
    }
    // If not, then open it
    else {
      setSelectedChat(currentChatId);
    }
  };

  // Deleting a chat
  const handleDelete = async (e, currentChatId) => {
    e.preventDefault();

    // Prevent triggering the event of also navigating to the chat's page too
    e.stopPropagation();

    try {
        // Attempt to delete the chat
        await axios.delete(
            `http://localhost:8000/chats/delete/${currentChatId}`,
            { withCredentials: true },
        );

        // If successful, remove the chat from the displayed list of chats too
        setUserChats((prev) => prev.filter(eachChat => eachChat.id !== currentChatId))

        // And also close the context menu of the now deleted chat
        setSelectedChat(null);

        // If the user deleted the chat that they were currently on, redirect them back to the home page
        if (chatId == currentChatId) {
            navigate("/")
        }
    } catch (error) {
      // If an error occured, display a popup with an error message
      const errorMessage = error.response?.data?.message || error.message;
      const notify = () => toast.error(`Failed to delete chat: ${errorMessage}`, {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
      notify();
    }
  };

  return (
    <div className={`fixed bg-white min-h-screen z-20 transition-all duration-200 shadow ${isOpen ? "w-64" : "w-16"}`}>

      {/*Title and sidebar button*/}
      <div className="p-4 flex justify-between items-center shadow">
        <div className={`text-xl font-bold ${isOpen ? "visible" : "hidden"}`}>
          Chatbot-Clone
        </div>
        <button
          className="p-2 font-bold cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <FiSidebar size={24} />
        </button>
      </div>

      {/*New chat button*/}
      <button
        className={`absolute flex flex-row gap-2 items-center left-1/2 -translate-x-1/2 mt-4 ${isProcessing ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
        onClick={() => navigate("/")}
        disabled={isProcessing}
      >
        <CiCirclePlus size={24} />
        <span className={`font-bold ${isOpen ? "visible" : "hidden"}`}>
          New Chat
        </span>
      </button>

      {/*User chats*/}
      <div className={`flex flex-col mt-10 ${isOpen ? "visible" : "hidden"}`}>
        <span className="ml-4 mt-4 font-bold">Recent Chats:</span>
        <div className="flex flex-col gap-2 py-3 px-3 h-120 overflow-y-auto">
          {userChats.map((userChat) => (
            <div
              key={userChat.id}
              className={`relative flex flex-row justify-between w-full p-2 rounded hover:bg-gray-100 ${isProcessing ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
              onClick={() => {if (!isProcessing) navigate(`/chat/${userChat.id}`);}}
            >
              {/*Chat title and button to open a chat's context menu*/}
              <h1 className="truncate">{userChat.title}</h1>
              <button
                className={`rounded hover:bg-gray-300 ${isProcessing ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                onClick={(e) => handleOpeningContextMenu(e, userChat.id)}
                disabled={isProcessing}
              >
                <BsThreeDotsVertical />
              </button>

              {/*Context menu buttons*/}
              <div
                className={`absolute top-full left-0 bg-white w-full shadow rounded z-30 ${selectedChat === userChat.id ? "visible" : "hidden"}`}
              >
                {/*Delete button*/}
                <button 
                    className={`flex flex-row py-3 px-3 hover:bg-gray-100 w-full ${isProcessing ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
                    onClick={(e) => handleDelete(e, userChat.id)}
                    disabled={isProcessing}
                >
                  <GoTrash size={24} />
                  <p className="ml-4">Delete</p>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/*Logout button*/}
      <button
        className={`absolute flex flex-row gap-2 items-center left-1/2 -translate-x-1/2 bottom-10 ${isProcessing ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
        onClick={handleLogout}
        disabled={isProcessing}
      >
        <IoIosLogOut size={24} />
        <span className={`font-bold ${isOpen ? "visible" : "hidden"}`}>
          Logout
        </span>
      </button>
    </div>
  );
};

export default Sidebar;
