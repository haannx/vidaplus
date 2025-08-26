import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css'

const Container = styled.div`
  padding: 40px;
  color: white;
  background-color: #ffffffff;
  min-height: 100vh;
`

const Titulo = styled.h2`
  margin-bottom: 20px;
`

const ListaConsultas = styled.div`
  margin-top: 30px;
  background-color: #ffffffff;
  padding: 20px;
  border-radius: 10px;
  color: #000;
`

const ConsultaItem = styled.div`
  background-color: #ffffff;
  color: #000;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 6px;
  border-left: 5px solid ${props => (props.passada ? '#c0392b' : '#2ecc71')};
  border: 3px solid #ccc;
`

const CalendarioContainer = styled.div`
  max-width: 400px;
  .react-calendar {
    background-color: #ffffffff;
    border: 3px 3px;
    color: #000;
  }
  .react-calendar__tile--active {
    background-color: #007bff !important;
  }
  .react-calendar__tile {
    color: #000;
  }
`

const Botoes = styled.div`
  margin-top: 10px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`

const Botao = styled.button`
  padding: 8px 12px;
  border: none;
  cursor: pointer;
  color: white;
  background-color: ${props => props.cor || '#007bff'};
  border-radius: 4px;

  &:hover {
    opacity: 0.8;
  }
`

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const ModalContent = styled.div`
  background-color: #222;
  padding: 30px;
  border-radius: 10px;
  color: white;
  width: 400px;
`

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  color: white;
  background: #333;
  border: 1px solid #555;
`

const TextArea = styled.textarea`
  width: 100%;
  height: 80px;
  margin-top: 10px;
  padding: 10px;
  color: white;
  background: #333;
  border: 1px solid #555;
  resize: none;
`

const ModalButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  flex-wrap: wrap;
  gap: 10px;
`

const AgendaMedico = () => {
  const [dataSelecionada, setDataSelecionada] = useState(new Date())
  const [consultas, setConsultas] = useState([])
  const [clientes, setClientes] = useState([])
  const [modalConsulta, setModalConsulta] = useState(null)
  const [consultaParaCancelar, setConsultaParaCancelar] = useState(null)
  const [editData, setEditData] = useState('')
  const [editHora, setEditHora] = useState('')
  const [editMotivo, setEditMotivo] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const armazenadas = JSON.parse(localStorage.getItem('agendamentos')) || []
    setConsultas(armazenadas)

    const dadosClientes = JSON.parse(localStorage.getItem('clientes')) || []
    setClientes(dadosClientes)
  }, [])

  const formatarData = (data) => {
    return new Date(data).toISOString().split('T')[0]
  }

  const consultasDoDia = consultas.filter(c => formatarData(c.data) === formatarData(dataSelecionada))

  const obterNomePaciente = (id) => {
    const cliente = clientes.find(c => c.id === id)
    return cliente ? cliente.nome : 'Desconhecido'
  }

  const abrirEdicao = (consulta) => {
    setModalConsulta(consulta)
    setEditData(consulta.data)
    setEditHora(consulta.hora)
    setEditMotivo(consulta.motivo)
  }

  const salvarEdicao = () => {
    const atualizadas = consultas.map(c =>
      c === modalConsulta
        ? { ...c, data: editData, hora: editHora, motivo: editMotivo }
        : c
    )
    setConsultas(atualizadas)
    localStorage.setItem('agendamentos', JSON.stringify(atualizadas))
    setModalConsulta(null)
  }

  const cancelarConsulta = () => {
    const atualizadas = consultas.filter(c => c !== consultaParaCancelar)
    setConsultas(atualizadas)
    localStorage.setItem('agendamentos', JSON.stringify(atualizadas))
    setConsultaParaCancelar(null)
  }

  return (
    <Container>
      <Titulo>Agenda do Médico</Titulo>
      <CalendarioContainer>
        <Calendar
          onChange={setDataSelecionada}
          value={dataSelecionada}
        />
      </CalendarioContainer>

      <ListaConsultas>
        <h3>Consultas em {formatarData(dataSelecionada)}</h3>
        {consultasDoDia.length === 0 ? (
          <p>Nenhuma consulta agendada neste dia.</p>
        ) : (
          consultasDoDia.map((consulta, index) => {
            const dataConsulta = new Date(consulta.data + 'T' + consulta.hora)
            const passada = dataConsulta < new Date()
            const nomePaciente = obterNomePaciente(consulta.idPaciente)

            return (
              <ConsultaItem key={index} passada={passada}>
                <strong>Paciente:</strong> {nomePaciente} (ID: {consulta.idPaciente})<br />
                <strong>Hora:</strong> {consulta.hora}<br />
                <strong>Motivo:</strong> {consulta.motivo}

                <Botoes>
                  {!passada && (
                    <>
                      <Botao cor="#28a745" onClick={() => abrirEdicao(consulta)}>
                        Editar Consulta
                      </Botao>
                      <Botao cor="#dc3545" onClick={() => setConsultaParaCancelar(consulta)}>
                        Cancelar Consulta
                      </Botao>
                    </>
                  )}
                  <Botao cor="#6c757d" onClick={() => navigate(`/pacientes/${consulta.idPaciente}`)}>
                    Ver Paciente
                  </Botao>
                </Botoes>
              </ConsultaItem>
            )
          })
        )}
      </ListaConsultas>

      {modalConsulta && (
        <ModalOverlay>
          <ModalContent>
            <h3>Editar Consulta</h3>
            <label>Data:</label>
            <Input type="date" value={editData} onChange={e => setEditData(e.target.value)} />
            <label>Hora:</label>
            <Input type="time" value={editHora} onChange={e => setEditHora(e.target.value)} />
            <label>Motivo:</label>
            <TextArea value={editMotivo} onChange={e => setEditMotivo(e.target.value)} />
            <ModalButtons>
              <Botao cor="#28a745" onClick={salvarEdicao}>Salvar</Botao>
              <Botao cor="#6c757d" onClick={() => setModalConsulta(null)}>Cancelar</Botao>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}

      {consultaParaCancelar && (
        <ModalOverlay>
          <ModalContent>
            <h3>Confirmar Cancelamento</h3>
            <p>Tem certeza que deseja cancelar a consulta com <strong>{obterNomePaciente(consultaParaCancelar.idPaciente)}</strong> no dia <strong>{formatarData(consultaParaCancelar.data)}</strong> às <strong>{consultaParaCancelar.hora}</strong>?</p>
            <ModalButtons>
              <Botao cor="#dc3545" onClick={cancelarConsulta}>Sim, Cancelar</Botao>
              <Botao cor="#6c757d" onClick={() => setConsultaParaCancelar(null)}>Voltar</Botao>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  )
}

export default AgendaMedico
