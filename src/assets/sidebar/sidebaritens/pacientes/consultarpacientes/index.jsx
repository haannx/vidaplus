import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { FaTrash } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom' // <== IMPORTANTE

const ContainerGeral = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow-y: scroll;
  padding-bottom: 20px;
`
const Container = styled.div`
  display: flex;
  justify-content: center;
`
const TituloGeral = styled.h1`
  color: #000;
  margin: 20px;
`
const InputPesquisa = styled.input`
  margin: 20px;
  padding: 10px;
  width: 300px;
  color: #000;
  border-radius: 10px;
`
const TabelaClientes = styled.table`
  margin: 20px;
  width: 80%;
  color: #000000ff;
`
const TituloTabela = styled.th`
  border: 1px solid #ccc;
  padding: 10px;
`
const ItensdaTabela = styled.td`
  padding: 7px;
`
const BotaoExcluir = styled.button`
  background: transparent;
  border: none;
  color: #ff0000;
  cursor: pointer;
  font-size: 20px;

  &:hover {
    color: #cc0000;
  }
`
const ConfirmDialog = styled.div`
  width: 400px;
  height: 300px;
  border: 1px solid #000;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
`
const GerenciaBotao = styled.div`
  padding: 20px;
`
const ConfirmButton = styled.button`
  padding: 10px;
  background-color: #28a745;
  color: #000;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100px;
  margin: 10px;

  &:hover {
    background-color: #218838;
  }
`
const CancelButton = styled.button`
  padding: 10px;
  background-color: grey;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  width: 100px;
  margin: 10px;

  &:hover {
    background-color: #218838;
  }
`
const CheckboxContainer = styled.div`
  margin-bottom: 10px;
  color: #000;
`
const CheckboxLabel = styled.label`
  margin-right: 10px;
`
const CheckBox = styled.input`
  margin: 10px;
`
const PaginacaoContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 20px;
`
const BotaoPaginacao = styled.button`
  padding: 10px 20px;
  margin: 5px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`

const ConsultaPacientes = () => {
  const [clientes, setClientes] = useState([])
  const [pesquisa, setPesquisa] = useState('')
  const [idParaExcluir, setIdParaExcluir] = useState(null)
  const [searchById, setSearchById] = useState(false)
  const [searchByNome, setSearchByNome] = useState(false)
  const [searchByCpf, setSearchByCpf] = useState(false)
  const [searchByEmail, setSearchByEmail] = useState(false)
  const [searchByTelefone, setSearchByTelefone] = useState(false)
  const [paginaAtual, setPaginaAtual] = useState(1)

  const navigate = useNavigate() // <== IMPORTANTE
  const clientesPorPagina = 10

  useEffect(() => {
    const clientesSalvos = JSON.parse(localStorage.getItem('clientes')) || []
    setClientes(clientesSalvos)
  }, [])

  const clientesFiltrados = clientes.filter((cliente) => {
    if (!searchById && !searchByNome && !searchByCpf && !searchByEmail && !searchByTelefone) {
      return true
    }
    const searchTermLower = pesquisa.toLowerCase()
    return (
      (searchById && cliente.id.toString().includes(pesquisa)) ||
      (searchByNome && cliente.nome && cliente.nome.toLowerCase().includes(searchTermLower)) ||
      (searchByCpf && cliente.cpf.toString().includes(pesquisa)) ||
      (searchByEmail && cliente.email.toLowerCase().includes(searchTermLower)) ||
      (searchByTelefone && cliente.telefone.includes(pesquisa))
    )
  })

  const indiceUltimoCliente = paginaAtual * clientesPorPagina
  const indicePrimeiroCliente = indiceUltimoCliente - clientesPorPagina
  const clientesPaginados = clientesFiltrados.slice(indicePrimeiroCliente, indiceUltimoCliente)

  const confirmarExclusao = (id) => {
    setIdParaExcluir(id)
  }

  const excluirCliente = () => {
    const clientesAtualizados = clientes.filter(cliente => cliente.id !== idParaExcluir)
    setClientes(clientesAtualizados)
    localStorage.setItem('clientes', JSON.stringify(clientesAtualizados))
    setIdParaExcluir(null)
  }

  const cancelarExclusao = () => {
    setIdParaExcluir(null)
  }

  const mudarPagina = (novaPagina) => {
    setPaginaAtual(novaPagina)
  }

  return (
    <ContainerGeral>
      <Container>
        <TituloGeral>Consulta de Pacientes</TituloGeral>
      </Container>
      <Container>
        <InputPesquisa type="text" placeholder="Pesquisar por nome, CPF/CNPJ ou ID" value={pesquisa} onChange={(e) => setPesquisa(e.target.value)} />
      </Container>
      <Container>
        <CheckboxContainer>
          <CheckboxLabel>
            <CheckBox type="checkbox" checked={searchById} onChange={(e) => setSearchById(e.target.checked)} />ID
          </CheckboxLabel>
          <CheckboxLabel>
            <CheckBox type="checkbox" checked={searchByNome} onChange={(e) => setSearchByNome(e.target.checked)} />Nome
          </CheckboxLabel>
          <CheckboxLabel>
            <CheckBox type="checkbox" checked={searchByEmail} onChange={(e) => setSearchByEmail(e.target.checked)} />Email
          </CheckboxLabel>
          <CheckboxLabel>
            <CheckBox type="checkbox" checked={searchByCpf} onChange={(e) => setSearchByCpf(e.target.checked)} />CPF
          </CheckboxLabel>
          <CheckboxLabel>
            <CheckBox type="checkbox" checked={searchByTelefone} onChange={(e) => setSearchByTelefone(e.target.checked)} />Telefone
          </CheckboxLabel>
        </CheckboxContainer>
      </Container>
      <Container>
        <TabelaClientes>
          <thead>
            <tr>
              <TituloTabela>ID</TituloTabela>
              <TituloTabela>Nome</TituloTabela>
              <TituloTabela>CPF</TituloTabela>
              <TituloTabela>Email</TituloTabela>
              <TituloTabela>Telefone</TituloTabela>
              <TituloTabela>Ações</TituloTabela>
            </tr>
          </thead>
          <tbody>
            {clientesPaginados.map((cliente) => (
              <tr
                key={cliente.id}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/pacientes/${cliente.id}`)}
              >
                <ItensdaTabela>{cliente.id}</ItensdaTabela>
                <ItensdaTabela>{cliente.nome}</ItensdaTabela>
                <ItensdaTabela>{cliente.cpf}</ItensdaTabela>
                <ItensdaTabela>{cliente.email}</ItensdaTabela>
                <ItensdaTabela>{cliente.telefone}</ItensdaTabela>
                <ItensdaTabela>
                  <BotaoExcluir
                    onClick={(e) => {
                      e.stopPropagation() // <== Impede o clique de redirecionar
                      confirmarExclusao(cliente.id)
                    }}
                  >
                    <FaTrash />
                  </BotaoExcluir>
                </ItensdaTabela>
              </tr>
            ))}
          </tbody>
        </TabelaClientes>
      </Container>

      <PaginacaoContainer>
        {Array.from({ length: Math.ceil(clientesFiltrados.length / clientesPorPagina) }, (_, i) => (
          <BotaoPaginacao key={i} onClick={() => mudarPagina(i + 1)}>
            {i + 1}
          </BotaoPaginacao>
        ))}
      </PaginacaoContainer>

      {idParaExcluir !== null && (
        <ConfirmDialog>
          <p>Tem certeza que deseja excluir este cliente?</p>
          <GerenciaBotao>
            <ConfirmButton onClick={excluirCliente}>Excluir</ConfirmButton>
            <CancelButton onClick={cancelarExclusao}>Cancelar</CancelButton>
          </GerenciaBotao>
        </ConfirmDialog>
      )}
    </ContainerGeral>
  )
}

export default ConsultaPacientes
