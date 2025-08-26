import { Route, Routes, Navigate } from 'react-router-dom'
import CadastrarPacientes from '../sidebar/sidebaritens/pacientes/cadastrarpaciente'
import ConsultaPacientes from '../sidebar/sidebaritens/pacientes/consultarpacientes'
import CadastroPaciente from '../sidebar/sidebaritens/pacientes/cadastropaciente'
import AgendaMedico from '../sidebar/sidebaritens/profissionais/agenda'
import GerenciarLeitos from '../sidebar/sidebaritens/admhosp/gerenciarleitos'
import LogsAuditoria from '../sidebar/sidebaritens/logsauditoria' // Import do Logs
import Login from '../login/index'
import Sidebar from '../sidebar'

// Wrapper com sidebar
const LayoutWithSidebar = ({ children }) => (
  <>
    <Sidebar />
    {children}
  </>
)

// Componente para proteger rotas e registrar logs
const ProtectedRoute = ({ children }) => {
  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'))

  // Função para registrar log
  const registrarLog = (acao) => {
    const logs = JSON.parse(localStorage.getItem('logsAuditoria')) || []
    const novoLog = {
      data: new Date().toLocaleString(),
      usuario: usuarioLogado?.email || 'Desconhecido',
      acao
    }
    logs.push(novoLog)
    localStorage.setItem('logsAuditoria', JSON.stringify(logs))
  }

  if (usuarioLogado) {
    // Registra automaticamente quando a rota for acessada
    registrarLog(`Acessou a página ${window.location.pathname}`)
    return <LayoutWithSidebar>{children}</LayoutWithSidebar>
  } else {
    return <Navigate to="/" />
  }
}

const AppRoutes = () => (
  <Routes>
    {/* Tela de login (rota pública) */}
    <Route path='/' element={<Login />} />

    {/* Rotas protegidas com Sidebar */}
    <Route path='/cadastrarpacientes' element={<ProtectedRoute><CadastrarPacientes /></ProtectedRoute>} />
    <Route path='/consultapacientes' element={<ProtectedRoute><ConsultaPacientes /></ProtectedRoute>} />
    <Route path='/pacientes/:id' element={<ProtectedRoute><CadastroPaciente /></ProtectedRoute>} />
    <Route path='/agenda' element={<ProtectedRoute><AgendaMedico /></ProtectedRoute>} />
    <Route path='/leitos' element={<ProtectedRoute><GerenciarLeitos /></ProtectedRoute>} />
    <Route path='/logs' element={<ProtectedRoute><LogsAuditoria /></ProtectedRoute>} /> {/* Nova rota */}
  </Routes>
)

export default AppRoutes
