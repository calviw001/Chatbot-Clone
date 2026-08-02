import React from 'react'

const Login = () => {
  return (
    <div className="relative flex justify-center items-center min-h-screen w-full bg-gray-100">

        <div className="relative flex flex-col justify-center items-center rounded-md drop-shadow-lg bg-white max-w-sm sm:max-w-md">

            <h1 className="mt-4 text-2xl">Login</h1>

            <form className="p-6 flex flex-col justify-center">

                <div className="flex flex-col mt-2">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        name="username"
                        id="username"
                        placeholder="username"
                        className="w-full sm:w-100 mt-2 py-3 px-3 rounded-lg bg-white border border-gray-100"
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
                    />
                </div>

                <button 
                    type="submit"
                    className="w-full sm:w-100 mt-2 py-3 px-3 rounded-lg text-white bg-gray-500 border border-gray-500"
                >
                    Submit
                </button>

                <p className="flex mt-2 justify-center items-center">Don't have an account? Signup!</p>

            </form>

        </div>

    </div>
  )
}

export default Login