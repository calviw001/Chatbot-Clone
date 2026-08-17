import { useEffect, useState, useContext } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { GoPlus } from "react-icons/go";
import axios from "axios";
import UserContext from "../context/UserContext";
import Sidebar from "../components/sidebar";
import MessageTextBox from "../components/messagetextbox";

const Chat = () => {
  // Initialize all variables
  const [userChatMessages, setUserChatMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const [inputMessage, setInputMessage] = useState("");
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
  const { user, isLoading, isProcessing, setIsProcessing } = useContext(UserContext);

  const navigate = useNavigate();
  const location = useLocation();

  const chatId = location.pathname.split("/")[2];

  // Activates when 'user' or 'isLoading' changes
  useEffect(() => {
    // If there is no user logged in after checking, redirect to the login page
    if (!isLoading && !user) {
      navigate("/auth/login");
    } else {
      console.log(user);
    }
  }, [user, isLoading]);

  // Get all of the user's chat messages from the database
  useEffect(() => {
    const fetchAllChatMessages = async () => {
      try {
        // Put all of the chat messages in the 'userChatMessages' variable if successful
        const res = await axios.get(
          `http://localhost:8000/chats/messages/get/${chatId}`,
          { withCredentials: true },
        );
        console.log(res.data);
        setUserChatMessages(res.data);
      } catch (error) {
        // If an error occured, just print it out for now
        console.log(
          "Failed to fetch chat messages: ",
          error.response?.data?.message || error.message,
        );
      }
    };
    fetchAllChatMessages();
  }, [chatId]);

  // Add new user message and AI message functionality
  const handleNewMessages = async (e) => {
    e.preventDefault();

    // Set up the input to the chats/messages/add_user_question/:id route
    const userInput = {
      content: inputMessage.trim(),
    };

    try {
      // Throw an error if the user failed to enter in a question
      if (!inputMessage.trim()) {
        throw new Error("Please ask a question.");
      }
      setIsAddButtonDisabled(true);
      setIsProcessing(true);

      // Attempt to save and display the new user message
      const userMessage = await axios.post(
        `http://localhost:8000/chats/messages/add_user_question/${chatId}`,
        userInput,
        { withCredentials: true },
      );
      console.log(userMessage.data);
      setUserChatMessages((prev) => [...prev, userMessage.data]);

      // Then attempt to save and display a new message from the AI as a response to the new user message
      const aiMessage = await axios.post(
        `http://localhost:8000/chats/messages/add_AI_response/${chatId}`,
        {},
        { withCredentials: true },
      );
      setUserChatMessages((prev) => [...prev, aiMessage.data]);

      // Clear the input box
      setInputMessage("");
    } catch (error) {
      // If an error occured, just print it out for now
      console.log(
        "Failed to display new messages: ",
        error.response?.data?.message || error.message,
      );
    } finally {
      setIsAddButtonDisabled(false);
      setIsProcessing(false);
    }
  };

  // Display 'Loading...' instead of the main content while waiting to check if there is a user currently logged in
  if (isLoading) return <div>Loading...</div>;
  if (!user) return null;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/*Sidebar*/}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} isProcessing={isProcessing}/>

      <main className={`flex-1 ml-14 transition-all duration-200 ${isOpen ? "lg:ml-64" : "lg:ml-14"}`}>

        {/*Header bar*/}
        <header className="bg-white sticky top-0 z-10 flex justify-end p-4 shadow">
          <div className="bg-gray-300 w-10 h-10 rounded-full"></div>
        </header>

        {/*Chat messages*/}
        <div className="flex flex-col mt-2 min-h-screen overflow-y-auto">
          {userChatMessages.map((userChatMessage) => (
            <div key={userChatMessage.id}>
              <MessageTextBox
                message={userChatMessage.content}
                role={userChatMessage.role}
              ></MessageTextBox>
            </div>
          ))}
        </div>

        {/*Add message input box and add button*/}
        <div className="bg-white sticky bottom-1 z-10 flex flex-col p-4 rounded-xl max-w-3xl mx-auto">
          <textarea
            name="userMessage"
            id="userMessage"
            placeholder="Ask Anything"
            rows={1}
            className="flex-1 field-sizing-content resize-none p-2 outline-none focus:outline-none max-h-40 overflow-y-auto"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isAddButtonDisabled}
          />
          <button
            className={`flex justify-start ${isAddButtonDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
            onClick={handleNewMessages}
            disabled={isAddButtonDisabled}
          >
            <GoPlus size={24} />
          </button>
        </div>
      </main>
    </div>
  );
};

export default Chat;
