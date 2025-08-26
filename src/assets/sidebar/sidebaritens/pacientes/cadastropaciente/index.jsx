import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import styled from 'styled-components'

const Container = styled.div`
  padding: 40px;
  color: #000;
`
const Info = styled.p`
  font-size: 18px;
`
const Botao = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`
const BotaoVermelho = styled(Botao)`
  background-color: #dc3545;

  &:hover {
    background-color: #b02a37;
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
  border-radius: 5px;
`

const CadastroPaciente = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [paciente, setPaciente] = useState(null)
  const [mostrarModal, setMostrarModal] = useState(false)
  const [data, setData] = useState('')
  const [hora, setHora] = useState('')
  const [motivo, setMotivo] = useState('')
  const [consultasPaciente, setConsultasPaciente] = useState([])
  const [consultaSelecionada, setConsultaSelecionada] = useState(null)
  const [editarData, setEditarData] = useState('')
  const [editarHora, setEditarHora] = useState('')
  const [editarMotivo, setEditarMotivo] = useState('')

  const [mostrarInternacao, setMostrarInternacao] = useState(false)
  const [leitos, setLeitos] = useState(Array(32).fill(null))
  const [leitoDoPaciente, setLeitoDoPaciente] = useState(null)

  // Estado do prontuário
  const [mostrarProntuario, setMostrarProntuario] = useState(false)
  const [prontuario, setProntuario] = useState([])
  const [novoRegistro, setNovoRegistro] = useState('')

  useEffect(() => {
    const pacientes = JSON.parse(localStorage.getItem('clientes')) || []
    const encontrado = pacientes.find(p => p.id === parseInt(id))
    setPaciente(encontrado)

    const todosAgendamentos = JSON.parse(localStorage.getItem('agendamentos')) || []
    const agendamentosDoPaciente = todosAgendamentos.filter(
      a => a.idPaciente === parseInt(id)
    )
    setConsultasPaciente(agendamentosDoPaciente)

    const leitosSalvos = JSON.parse(localStorage.getItem('leitos')) || Array(32).fill(null)
    setLeitos(leitosSalvos)

    const leitoIndex = leitosSalvos.findIndex(l => l === parseInt(id))
    setLeitoDoPaciente(leitoIndex !== -1 ? leitoIndex : null)

    // Carrega prontuário salvo
    const prontuarios = JSON.parse(localStorage.getItem('prontuarios')) || {}
    setProntuario(prontuarios[id] || [])

  }, [id])

  const internarPaciente = (index) => {
    if (leitos[index]) return
    const novosLeitos = [...leitos]
    const leitoAtual = novosLeitos.findIndex(l => l === paciente.id)
    if (leitoAtual !== -1) {
      novosLeitos[leitoAtual] = null
    }
    novosLeitos[index] = paciente.id
    setLeitos(novosLeitos)
    localStorage.setItem('leitos', JSON.stringify(novosLeitos))
    setLeitoDoPaciente(index)
    setMostrarInternacao(false)
  }

  const removerDoLeito = () => {
    if (leitoDoPaciente === null) return
    const novosLeitos = [...leitos]
    novosLeitos[leitoDoPaciente] = null
    setLeitos(novosLeitos)
    localStorage.setItem('leitos', JSON.stringify(novosLeitos))
    setLeitoDoPaciente(null)
  }

  const agendarConsulta = () => {
    if (!data || !hora || !motivo) {
      alert('Preencha todos os campos!')
      return
    }
    const agendamento = {
      idPaciente: parseInt(id),
      data,
      hora,
      motivo
    }
    const agendamentos = JSON.parse(localStorage.getItem('agendamentos')) || []
    agendamentos.push(agendamento)
    localStorage.setItem('agendamentos', JSON.stringify(agendamentos))
    alert('Consulta agendada com sucesso!')
    setMostrarModal(false)
    setData('')
    setHora('')
    setMotivo('')
    setConsultasPaciente([...consultasPaciente, agendamento])
  }

  const salvarEdicao = () => {
    const atualizados = consultasPaciente.map(c =>
      c === consultaSelecionada
        ? { ...c, data: editarData, hora: editarHora, motivo: editarMotivo }
        : c
    )
    setConsultasPaciente(atualizados)
    localStorage.setItem('agendamentos', JSON.stringify(
      JSON.parse(localStorage.getItem('agendamentos')).map(c =>
        c.idPaciente === parseInt(id) && c.data === consultaSelecionada.data && c.hora === consultaSelecionada.hora
          ? { ...c, data: editarData, hora: editarHora, motivo: editarMotivo }
          : c
      )
    ))
    setConsultaSelecionada(null)
  }

  // Funções do prontuário
  const adicionarRegistro = () => {
    if (!novoRegistro.trim()) return
    const novo = {
      data: new Date().toLocaleString(),
      texto: novoRegistro
    }
    const atualizado = [...prontuario, novo]
    setProntuario(atualizado)
    const prontuarios = JSON.parse(localStorage.getItem('prontuarios')) || {}
    prontuarios[id] = atualizado
    localStorage.setItem('prontuarios', JSON.stringify(prontuarios))
    setNovoRegistro('')
  }

  const removerRegistro = (index) => {
    const atualizado = prontuario.filter((_, i) => i !== index)
    setProntuario(atualizado)
    const prontuarios = JSON.parse(localStorage.getItem('prontuarios')) || {}
    prontuarios[id] = atualizado
    localStorage.setItem('prontuarios', JSON.stringify(prontuarios))
  }

  if (!paciente) return <Container>Paciente não encontrado.</Container>

  return (
    <Container>
      <h2>Cadastro do Paciente</h2>
      <Info><strong>ID:</strong> {paciente.id}</Info>
      <Info><strong>Nome:</strong> {paciente.nome}</Info>
      <Info><strong>CPF:</strong> {paciente.cpf}</Info>
      <Info><strong>Email:</strong> {paciente.email}</Info>
      <Info><strong>Telefone:</strong> {paciente.telefone}</Info>

      {leitoDoPaciente !== null ? (
        <Info><strong>Internado no Leito:</strong> {leitoDoPaciente + 1}</Info>
      ) : (
        <Info><strong>Não está internado em nenhum leito.</strong></Info>
      )}

      <div style={{ display: 'flex', gap: '10px' }}>
        <Botao onClick={() => setMostrarModal(true)}>Agendar Consulta</Botao>
        <Botao onClick={() => setMostrarInternacao(true)} style={{ backgroundColor: '#17a2b8' }}>Internar</Botao>
        <Botao style={{ backgroundColor: '#6f42c1' }} onClick={() => setMostrarProntuario(true)}>Prontuário</Botao>
        {leitoDoPaciente !== null && (
          <BotaoVermelho onClick={removerDoLeito}>Remover do Leito</BotaoVermelho>
        )}
      </div>

      {/* Modal de agendamento */}
      {mostrarModal && (
        <ModalOverlay>
          <ModalContent>
            <h3>Agendar Consulta</h3>
            <label>Data:</label>
            <Input type="date" value={data} onChange={(e) => setData(e.target.value)} />
            <label>Hora:</label>
            <Input type="time" value={hora} onChange={(e) => setHora(e.target.value)} />
            <label>Motivo:</label>
            <TextArea value={motivo} onChange={(e) => setMotivo(e.target.value)} />
            <ModalButtons>
              <Botao onClick={agendarConsulta}>Confirmar</Botao>
              <Botao style={{ backgroundColor: '#6c757d' }} onClick={() => setMostrarModal(false)}>Cancelar</Botao>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Modal de internação */}
      {mostrarInternacao && (
        <ModalOverlay>
          <ModalContent style={{ width: '600px' }}>
            <h3>Selecionar Leito</h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(8, 1fr)',
              gap: '10px',
              marginTop: '20px'
            }}>
              {leitos.map((ocupanteId, index) => {
                const ocupado = ocupanteId !== null
                return (
                  <div
                    key={index}
                    onClick={() => internarPaciente(index)}
                    style={{
                      width: '60px',
                      height: '60px',
                      backgroundColor: ocupado ? '#dc3545' : '#28a745',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: ocupado ? 'not-allowed' : 'pointer',
                      borderRadius: '8px',
                      fontWeight: 'bold'
                    }}
                    title={ocupado ? `Ocupado por ID ${ocupanteId}` : 'Disponível'}
                  >
                    {index + 1}
                  </div>
                )
              })}
            </div>
            <ModalButtons>
              <Botao style={{ backgroundColor: '#6c757d' }} onClick={() => setMostrarInternacao(false)}>Fechar</Botao>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}

      {/* Modal do prontuário */}
      {mostrarProntuario && (
        <ModalOverlay>
          <ModalContent style={{ width: '500px' }}>
            <h3>Prontuário do Paciente</h3>
            <label>Adicionar Registro:</label>
            <TextArea
              value={novoRegistro}
              onChange={(e) => setNovoRegistro(e.target.value)}
            />
            <ModalButtons>
              <Botao onClick={adicionarRegistro}>Salvar Registro</Botao>
              <Botao style={{ backgroundColor: '#6c757d' }} onClick={() => setMostrarProntuario(false)}>Fechar</Botao>
            </ModalButtons>
            <h4 style={{ marginTop: '20px' }}>Histórico</h4>
            {prontuario.length === 0 ? (
              <p>Sem registros no prontuário.</p>
            ) : (
              prontuario.map((reg, i) => (
                <div key={i} style={{
                  background: '#333',
                  padding: '10px',
                  borderRadius: '5px',
                  marginTop: '10px'
                }}>
                  <p><strong>{reg.data}</strong></p>
                  <p>{reg.texto}</p>
                  <BotaoVermelho style={{ marginTop: '5px' }} onClick={() => removerRegistro(i)}>Excluir</BotaoVermelho>
                </div>
              ))
            )}
          </ModalContent>
        </ModalOverlay>
      )}

      <h3 style={{ marginTop: '40px' }}>Consultas Agendadas</h3>
      {consultasPaciente.length === 0 ? (
        <p>Sem consultas agendadas.</p>
      ) : (
        consultasPaciente.map((consulta, index) => {
          const dataHoraConsulta = new Date(`${consulta.data}T${consulta.hora}`)
          const agora = new Date()
          const consultaPassada = dataHoraConsulta < agora
          return (
            <Botao
              key={index}
              style={{
                backgroundColor: consultaPassada ? '#dc3545' : '#28a745',
                marginTop: '10px',
                padding: '10px 20px',
                margin: '5px'
              }}
              onClick={() => {
                setConsultaSelecionada(consulta)
                setEditarData(consulta.data)
                setEditarHora(consulta.hora)
                setEditarMotivo(consulta.motivo)
              }}
            >
              {consulta.data} às {consulta.hora}
            </Botao>
          )
        })
      )}

      {consultaSelecionada && (
        <ModalOverlay>
          <ModalContent>
            <h3>Detalhes da Consulta</h3>
            <label>Data:</label>
            <Input
              type="date"
              value={editarData}
              onChange={(e) => setEditarData(e.target.value)}
              disabled={new Date(`${consultaSelecionada.data}T${consultaSelecionada.hora}`) < new Date()}
            />
            <label>Hora:</label>
            <Input
              type="time"
              value={editarHora}
              onChange={(e) => setEditarHora(e.target.value)}
              disabled={new Date(`${consultaSelecionada.data}T${consultaSelecionada.hora}`) < new Date()}
            />
            <label>Motivo:</label>
            <TextArea
              value={editarMotivo}
              onChange={(e) => setEditarMotivo(e.target.value)}
              disabled={new Date(`${consultaSelecionada.data}T${consultaSelecionada.hora}`) < new Date()}
            />
            <ModalButtons>
              {new Date(`${consultaSelecionada.data}T${consultaSelecionada.hora}`) > new Date() && (
                <Botao onClick={salvarEdicao}>Salvar Alterações</Botao>
              )}
              <Botao style={{ backgroundColor: '#6c757d' }} onClick={() => setConsultaSelecionada(null)}>Fechar</Botao>
            </ModalButtons>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  )
}

export default CadastroPaciente


