import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useNavigate, useLocation } from 'react-router-dom'

const SidebarContainer = styled.div`
  width: ${props => (props.isOpen ? '220px' : '20px')};
  height: 100vh;
  background-color: #254b9eff;
  color: white;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  transition: width 0.3s ease;
  z-index: 1000;
  overflow-x: hidden;
  border-right: 1px solid #444;
`

const SidebarItem = styled.div`
  padding: 15px;
  font-size: 14px;
  font-family: arial;
  cursor: pointer;
  border-bottom: 1px solid #333;
  display: flex;
  align-items: center;
  white-space: nowrap;
  background-color: ${props => (props.active ? '#1e3d80' : 'transparent')};
  font-weight: normal;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #1e3d80;
  }
`

const SidebarItemText = styled.span`
  margin-left: 8px;
  display: ${props => (props.isOpen ? 'inline' : 'none')};
`

const SidebarSubItem = styled.div`
  padding: 10px 30px;
  font-size: 12px;
  font-family: arial;
  cursor: pointer;
  border-bottom: 1px solid #444;
  background-color: ${props => (props.active ? '#466edf' : '#254b9eff')};
  margin-left: 5px;
  border-left: 3px solid #fff;
  font-weight: normal;
  transition: all 0.2s ease;

  &:hover {
    background-color: #466edf;
  }
`

const SubItemWrapper = styled.div`
  display: ${props => (props.isVisible ? 'block' : 'none')};
`

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [activeItem, setActiveItem] = useState(null)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Abre automaticamente o menu ao qual a rota pertence
    if (location.pathname.includes('cadastrarpacientes') || location.pathname.includes('consultapacientes')) {
      setActiveItem('pacientes')
    } else if (location.pathname.includes('agenda') || location.pathname.includes('prontuario')) {
      setActiveItem('profissionais')
    } else if (location.pathname.includes('leitos')) {
      setActiveItem('administracao')
    } else if (location.pathname.includes('logs')) {
      setActiveItem('seguranca')
    }
  }, [location.pathname])

  const handleNavigation = (path) => {
    navigate(path)
  }

  return (
    <SidebarContainer
      isOpen={isOpen}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Pacientes */}
      <SidebarItem
        onClick={() => setActiveItem('pacientes')}
        active={activeItem === 'pacientes'}
      >
        <SidebarItemText isOpen={isOpen}>Pacientes</SidebarItemText>
      </SidebarItem>
      <SubItemWrapper isVisible={isOpen && activeItem === 'pacientes'}>
        <SidebarSubItem
          onClick={() => handleNavigation('/cadastrarpacientes')}
          active={location.pathname === '/cadastrarpacientes'}
        >
          Cadastrar Paciente
        </SidebarSubItem>
        <SidebarSubItem
          onClick={() => handleNavigation('/consultapacientes')}
          active={location.pathname === '/consultapacientes'}
        >
          Consulta Paciente
        </SidebarSubItem>
      </SubItemWrapper>

      {/* Profissionais */}
      <SidebarItem
        onClick={() => setActiveItem('profissionais')}
        active={activeItem === 'profissionais'}
      >
        <SidebarItemText isOpen={isOpen}>Profissionais de Saúde</SidebarItemText>
      </SidebarItem>
      <SubItemWrapper isVisible={isOpen && activeItem === 'profissionais'}>
        <SidebarSubItem
          onClick={() => handleNavigation('/agenda')}
          active={location.pathname === '/agenda'}
        >
          Gerenciar Agenda
        </SidebarSubItem>
        <SidebarSubItem
          onClick={() => handleNavigation('/prontuario')}
          active={location.pathname === '/prontuario'}
        >
          Telemedicina
        </SidebarSubItem>
      </SubItemWrapper>

      {/* Administração Hospitalar */}
      <SidebarItem
        onClick={() => setActiveItem('administracao')}
        active={activeItem === 'administracao'}
      >
        <SidebarItemText isOpen={isOpen}>Administração Hospitalar</SidebarItemText>
      </SidebarItem>
      <SubItemWrapper isVisible={isOpen && activeItem === 'administracao'}>
        <SidebarSubItem
          onClick={() => handleNavigation('/leitos')}
          active={location.pathname === '/leitos'}
        >
          Gerenciar Leitos
        </SidebarSubItem>
      </SubItemWrapper>

      {/* Segurança */}
      <SidebarItem
        onClick={() => setActiveItem('seguranca')}
        active={activeItem === 'seguranca'}
      >
        <SidebarItemText isOpen={isOpen}>Segurança e Compliance</SidebarItemText>
      </SidebarItem>
      <SubItemWrapper isVisible={isOpen && activeItem === 'seguranca'}>
        <SidebarSubItem
          onClick={() => handleNavigation('/logs')}
          active={location.pathname === '/logs'}
        >
          Logs e Auditoria
        </SidebarSubItem>
      </SubItemWrapper>
    </SidebarContainer>
  )
}

export default Sidebar




