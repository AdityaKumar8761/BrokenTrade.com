import { Routes , Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { PaperTrading } from './pages/PaperTrading'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={ <HomePage/>} />
      <Route path="/login" element={ <LoginPage/> } />
      <Route path="/practice" element={ <PaperTrading/>} />
     </Routes>
  )
}

export default App
