import { Routes , Route } from 'react-router-dom'
import { HomePage } from './pages/HomePage'
import { LoginPage } from './pages/LoginPage'
import { PaperTrading } from './pages/PaperTrading'
import { DashboardRouter } from './pages/DashboardRouter'
import { DocumentationPage } from './pages/DocumentationPage'
import { CoursesPage } from './pages/CoursesPage'
import { ProfilePage } from './pages/ProfilePage'
import { BrokersPage } from './pages/BrokersPage'
import { BrokerDetailPage } from './pages/BrokerDetailPage'
import { InstructorUploadPage } from './pages/InstructorUploadPage'
import { InstructorCoursePage } from './pages/InstructorCoursePage'
import { ToolsPage } from './pages/ToolsPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/" element={ <HomePage/>} />
      <Route path="/login" element={ <LoginPage/> } />
      <Route path="/practice" element={ <PaperTrading/>} />
      <Route path="/My-Dashboard" element={ <DashboardRouter/> } />
      <Route path="/learn" element={ <DocumentationPage/> } />
      <Route path="/courses" element={ <CoursesPage /> } />
      <Route path="/brokers" element={ <BrokersPage /> } />
      <Route path="/chat/broker/:brokerId" element={ <BrokerDetailPage /> } />
      <Route path="/chat/id/:chatId" element={ <BrokerDetailPage /> } />
      <Route path="/broker/id/:chatId" element={ <BrokerDetailPage /> } />
      <Route path="/instructor-course/:courseId" element={ <InstructorCoursePage /> } />
      <Route path="/profile" element={ <ProfilePage /> } />
      <Route path="/instructor/upload" element={ <InstructorUploadPage /> } />
      <Route path="/instructor/course/:courseId/edit" element={ <InstructorUploadPage /> } />
      <Route path="/tools" element={ <ToolsPage /> } />
    </Routes>
  )
}

export default App
