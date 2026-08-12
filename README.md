# Chatbot-Clone

This is a chatbot program based on ChatGPT. It allows users to sign up, login, and start chats with an AI chatbot. This is a full-stack project built using React, Node.js/Express, and SQL.

## Features

- User authentication (signup, login, logout) with session-based auth
- Create and view chats
- View a scrollable list of past messages in each chat
- Ask questions and then receive AI-generated responses
- Chat titles are generated automatically based on the user's first question 
- Collapsible sidebar with a scrollable list of past chats
- Responsive, mobile-friendly design

## Databases

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE chats (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  user_id INTEGER NOT NULL,
  title VARCHAR(100) DEFAULT 'New Chat',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTO_INCREMENT,
  chat_id INTEGER NOT NULL,
  role VARCHAR(20) NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (chat_id) REFERENCES chats (id) ON DELETE CASCADE
);
```

## API Overview

| Method | Route | Description |
|---|---|---|
| POST | `/auth/signup` | Signup and create a new account |
| POST | `/auth/login` | Login |
| POST | `/auth/logout` | Logout |
| GET | `/auth/user` | Get session information of the current logged-in user |
| GET | `/chats/get` | Get all chats for the logged-in user |
| GET | `/chats/get/:id` | Get only a specific chat for the logged-in user |
| POST | `/chats/add` | Create a new chat |
| GET | `/chats/messages/get/:id` | Get all messages in a chat |
| POST | `/chats/messages/add_user_question/:id` | Save a user message |
| POST | `/chats/messages/add_AI_response/:id` | Get and save an AI response |
