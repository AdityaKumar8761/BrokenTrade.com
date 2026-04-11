import { Routes , Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { PaperTrading } from './pages/PaperTrading'
import { DashboardRouter } from './pages/DashboardRouter'
import { DocumentationPage } from './pages/DocumentationPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={ <HomePage/>} />
      <Route path="/login" element={ <LoginPage/> } />
      <Route path="/practice" element={ <PaperTrading/>} />
      <Route path="/My-Dashboard" element={ <DashboardRouter/> } />
      <Route path="/learn" element={ <DocumentationPage/> } />
     </Routes>
  )
}

export default App
