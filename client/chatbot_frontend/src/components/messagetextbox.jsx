import React from 'react'

const MessageTextBox = ({ message, role }) => {
  return (
    <div className={`flex w-full ${role === "user" ? "justify-end" : "justify-start"}`}>
      <div className={`p-2 m-2 rounded bg-white ${role === "user" ? "inline-block" : "block w-full"}`}>
        <p>{message}</p>
      </div>
    </div>
  )
}

export default MessageTextBox