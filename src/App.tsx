import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import ProposalPage from './pages/ProposalPage'
import ProfileSetup from './pages/ProfileSetup'

function Shell() {
    return (
        <div className="app-shell">
            <header className="app-nav">
                <div className="app-brand">
                    <div className="app-mark" aria-hidden="true" />
                    <div className="app-brand-copy">
                        <p className="app-brand-title">DreamDAO</p>
                        <p className="app-brand-subtitle">Autonomous governance cockpit</p>
                    </div>
                </div>

                <nav className="nav-links" aria-label="Primary">
                    <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
                        Dashboard
                    </NavLink>
                    <NavLink to="/proposal" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
                        Proposal
                    </NavLink>
                    <NavLink to="/profile" className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
                        Profile
                    </NavLink>
                </nav>

                <div className="somnia-badge">
                    <span className="somnia-badge-dot" aria-hidden="true" />
                    Somnia live rail
                </div>
            </header>

            <main className="app-main">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/proposal" element={<ProposalPage />} />
                    <Route path="/profile" element={<ProfileSetup />} />
                </Routes>
            </main>
        </div>
    )
}

export default function App() {
    return (
        <BrowserRouter>
            <Shell />
        </BrowserRouter>
    )
}
