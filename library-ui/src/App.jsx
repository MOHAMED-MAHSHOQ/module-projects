import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import CallbackPage from './pages/CallbackPage'
import BooksPage from './pages/BooksPage'
import UsersPage from './pages/UsersPage'
import Layout from './components/Layout'

function ProtectedRoute({ children, requiredRoles }) {
    const { accessToken, getRoles } = useAuth()
    if (!accessToken) return <Navigate to="/" replace />
    if (requiredRoles) {
        const roles = getRoles()
        const hasAccess = requiredRoles.some(r => roles.includes(r))
        if (!hasAccess) return <Navigate to="/books" replace />
    }
    return children
}

function AppRoutes() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/callback" element={<CallbackPage />} />
            <Route path="/books" element={
                <ProtectedRoute requiredRoles={['USER', 'ADMIN', 'SUPERADMIN']}>
                    <Layout>
                        <BooksPage />
                    </Layout>
                </ProtectedRoute>
            } />
            <Route path="/users" element={
                <ProtectedRoute requiredRoles={['SUPERADMIN']}>
                    <Layout>
                        <UsersPage />
                    </Layout>
                </ProtectedRoute>
            } />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    )
}

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <AppRoutes />
            </BrowserRouter>
        </AuthProvider>
    )
}