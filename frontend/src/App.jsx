import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import LandingPage from './pages/LandingPage'
import Chat from './pages/chatbot/Chat'
import AdminPage from './pages/admin/AdminPage'
import LoginPage from './pages/authentication/LoginPage'
import RegisterPage from './pages/authentication/RegisterPage'
import { AdminContentProvider } from './context/AdminContentProvider'
import { ChatContentProvider } from './context/ChatContentProvider'

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/' element={<LandingPage />} />
          <Route path='/chat' element={
            <ChatContentProvider>
              <Chat />
            </ChatContentProvider>
          } />
          <Route path="/admin" element={<Navigate to="/admin/overview" replace />} />
          <Route path="/admin/:section" element={
            <AdminContentProvider>
              <AdminPage />
            </AdminContentProvider>
          } />
        </Routes>
      </Router>
    </>
  )
}

export default App
