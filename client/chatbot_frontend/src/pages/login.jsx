import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'


const Login = () => {

    // Initialize all variables
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()

    // Submit button functionality
    const handleSubmit = async e => {
        e.preventDefault()

        // Set up the input to the auth/login route
        const userInput = {
            "username": username,
            "email": email,
            "password": password
        }

        try{
            // Throw an error if the user failed to fill in all fields
            if (!username.trim() || !email.trim() || !password.trim()) {
                throw new Error("Please fill in all fields.")
            }

            // Then, attempt to login with the entered in user information
            await axios.post("http://localhost:8000/auth/login", userInput, { withCredentials: true })
            navigate("/")
        } catch(error) {
    
            // If an error occured, just print it out for now  
            console.log("Failed to login: ", error.response?.data?.message || error.message)
        }
    }

    return (
        <div className="relative flex justify-center items-center min-h-screen w-full bg-gray-100">

            <div className="relative flex flex-col justify-center items-center rounded-md drop-shadow-lg bg-white max-w-sm sm:max-w-md">

                <h1 className="mt-4 text-2xl">Login</h1>

                <form className="p-6 flex flex-col justify-center" onSubmit={handleSubmit}>

                    <div className="flex flex-col mt-2">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            placeholder="username"
                            className="w-full sm:w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-100"
                            onChange={(e) => {setUsername(e.target.value)}}
                        />
                    </div>

                    <div className="flex flex-col mt-2">
                        <label htmlFor="email">Email:</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="email"
                            className="w-full sm:w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-100"
                            onChange={(e) => {setEmail(e.target.value)}}
                        />
                    </div>

                    <div className="flex flex-col mt-2">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="password"
                            className="w-full sm:w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-100"
                            onChange={(e) => {setPassword(e.target.value)}}
                        />
                    </div>

                    <button 
                        type="submit"
                        className="w-full sm:w-100 mt-2 py-3 px-3 rounded-lg text-white bg-gray-500 border border-gray-500"
                        onClick={handleSubmit}
                    >
                        Submit
                    </button>

                    <p className="flex mt-2 justify-center items-center">Don't have an account?  
                        <Link to="/auth/signup">Sign Up!</Link>
                    </p>

                </form>

            </div>

        </div>
    )
}

export default Login