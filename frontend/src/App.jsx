import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import LandingPage from './pages/LandingPage'
import Chat from './pages/chatbot/Chat'
import AdminPage from './pages/admin/AdminPage'
import LoginPage from './pages/authentication/LoginPage'
import RegisterPage from './pages/authentication/RegisterPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Router>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/' element={<LandingPage />} />
          <Route path='/chat' element={<Chat />} />
          <Route path='/admin' element={<AdminPage />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
