import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from './layouts/AdminLayout'
import { PublicLayout } from './layouts/PublicLayout'
import { AgendaPage } from './pages/admin/AgendaPage'
import { DashboardPage } from './pages/admin/DashboardPage'
import { ReportsPage } from './pages/admin/ReportsPage'
import { TasksPage } from './pages/admin/TasksPage'
import { TimePage } from './pages/admin/TimePage'
import { AboutPage } from './pages/public/AboutPage'
import { CeereSioPage } from './pages/public/CeereSioPage'
import { ContactPage } from './pages/public/ContactPage'
import { HomePage } from './pages/public/HomePage'
import { LoginPage } from './pages/public/LoginPage'
import { ServicesPage } from './pages/public/ServicesPage'
import { ProtectedRoute } from './routes/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<HomePage />} />
          <Route path="ceere-sio" element={<CeereSioPage />} />
          <Route path="servicios" element={<ServicesPage />} />
          <Route path="nosotros" element={<AboutPage />} />
          <Route path="contacto" element={<ContactPage />} />
        </Route>

        <Route path="login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="admin" element={<AdminLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="tareas" element={<TasksPage />} />
            <Route path="agenda" element={<AgendaPage />} />
            <Route path="tiempo" element={<TimePage />} />
            <Route path="reportes" element={<ReportsPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
