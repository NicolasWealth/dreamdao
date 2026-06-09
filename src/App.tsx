import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import ProposalPage from './pages/ProposalPage'
import ProfileSetup from './pages/ProfileSetup'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/proposal" element={<ProposalPage />} />
                <Route path="/profile" element={<ProfileSetup />} />
            </Routes>
        </BrowserRouter>
    )
}

