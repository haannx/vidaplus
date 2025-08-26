// Novo arquivo: src/assets/sidebar/sidebaritens/admhosp/gerenciarleitos/index.jsx

import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  color: #fff;
`

const Titulo = styled.h1`
  margin-bottom: 20px;
`

const GridLeitos = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 800px;
`

const Leito = styled.div`
  height: 100px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  background-color: ${(props) => (props.ocupado ? '#dc3545' : '#28a745')};
  color: #fff;
  cursor: pointer;
  text-align: center;
`

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #1e1e1e;
  padding: 20px;
  border-radius: 10px;
  color: #fff;
  z-index: 1000;
  max-width: 400px;
  width: 90%;
`

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999;
`

const Input = styled.input`
  padding: 8px;
  width: 100%;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 1px solid #ccc;
  color: #000;
`

const Button = styled.button`
  background-color: #007bff;
  border: none;
  color: white;
  padding: 8px 12px;
  border-radius: 4px;
  margin: 5px;
  cursor: pointer;
  &:hover {
    background-color: #0056b3;
  }
`



const GerenciarLeitos = () => {
  const navigate = useNavigate()
  const [leitos, setLeitos] = useState([])
  const [clientes, setClientes] = useState([])
  const [modalLeito, setModalLeito] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const leitosStorage = JSON.parse(localStorage.getItem('leitos')) || Array(20).fill(null)
    setLeitos(leitosStorage)

    const clientesStorage = JSON.parse(localStorage.getItem('clientes')) || []
    setClientes(clientesStorage)
  }, [])

  const handleAtribuir = (index, pacienteId) => {
    const novoLeitos = [...leitos]
    novoLeitos[index] = pacienteId
    localStorage.setItem('leitos', JSON.stringify(novoLeitos))
    setLeitos(novoLeitos)
    setModalLeito(null)
  }

  const handleRemover = (index) => {
    const novoLeitos = [...leitos]
    novoLeitos[index] = null
    localStorage.setItem('leitos', JSON.stringify(novoLeitos))
    setLeitos(novoLeitos)
    setModalLeito(null)
  }

  const pacientesDisponiveis = clientes.filter(cliente => !leitos.includes(cliente.id))
  const pacientesFiltrados = pacientesDisponiveis.filter(cliente => {
    const termo = searchTerm.toLowerCase()
    return (
      cliente.nome.toLowerCase().includes(termo) ||
      cliente.id.toString().includes(termo)
    )
  })

  const getPaciente = (id) => clientes.find(c => c.id === id)

  return (
    <Container>
      <Titulo>Gerenciar Leitos</Titulo>
      <GridLeitos>
        {leitos.map((ocupadoPor, index) => (
          <Leito
            key={index}
            ocupado={!!ocupadoPor}
            onClick={() => setModalLeito({ index, ocupadoPor })}
          >
            Leito {index + 1}
            <br />
            {ocupadoPor ? `Ocupado` : 'Disponível'}
          </Leito>
        ))}
      </GridLeitos>

      {modalLeito && (
        <>
          <Overlay onClick={() => setModalLeito(null)} />
          <Modal>
            <h3>Leito {modalLeito.index + 1}</h3>

            {!modalLeito.ocupadoPor ? (
              <>
                <Input
                  placeholder="Buscar por nome ou ID"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />

                {pacientesFiltrados.length > 0 ? (
                  pacientesFiltrados.map((paciente) => (
                    <div key={paciente.id}>
                      <span>{paciente.nome} (ID: {paciente.id})</span>
                      <Button onClick={() => handleAtribuir(modalLeito.index, paciente.id)}>
                        Atribuir
                      </Button>
                    </div>
                  ))
                ) : (
                  <p>Nenhum paciente disponível</p>
                )}
              </>
            ) : (
              <>
                <p>
                  Ocupado por: <strong>{getPaciente(modalLeito.ocupadoPor)?.nome || 'Paciente não encontrado'}</strong>
                </p>
                <Button onClick={() => navigate(`/pacientes/${modalLeito.ocupadoPor}`)}>
                  Ver Cadastro
                </Button>
                <Button onClick={() => handleRemover(modalLeito.index)}>Remover do Leito</Button>
              </>
            )}

            <Button onClick={() => setModalLeito(null)}>Fechar</Button>
          </Modal>
        </>
      )}
    </Container>
  )
}

export default GerenciarLeitos