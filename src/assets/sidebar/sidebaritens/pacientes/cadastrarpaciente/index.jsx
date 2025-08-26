import React, { useState } from 'react'
import styled from 'styled-components'


const ContainerGeral = styled.div`
    display: flex;
    flex-direction: column;
    width: 100vw;
    height: 100vh;
`
const Container = styled.div`
    max-width: 1000px;
    margin: 10px;
`
const TitulosPrincipal = styled.h1`
    color: #000;
    margin-top: 60px;
    margin-left: 60px;
`
const Titulos = styled.h2`
    color: #000;
`
const Input = styled.input`  
    margin-bottom: 10px;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    color: #000;
    width: 600px;
`
const Label = styled.label`
  width: 120px;
  color: #000;
  display: inline-block; 
`
const Button = styled.button`
    padding: 10px;
    background-color: #28a745;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    width: 100px;
    margin-left: 10px;

    &:hover {
        background-color: #218838;
    }
`
const Descricao = styled.div`
    color: #99AFBB;
    
`

const CadastrarPacientes = () => {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    observacoes: '',
    endereco: '',
    bairro: '',
    numero: '',
    email: '',
    telefone: '',
    complemento: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Verifica se todos os campos obrigatórios estão preenchidos
    const { nome, cpf, endereco, bairro, numero, email, telefone } = formData

    if (!nome || !cpf || !endereco || !bairro || !numero || !email || !telefone) {
      alert('Por favor, preencha todos os campos obrigatórios!')
      return
    }

    // Recupera dados já armazenados no localStorage ou cria um array vazio
    let clientes = JSON.parse(localStorage.getItem('clientes')) || []

    // Verifica se o CPF/CNPJ já existe
    const cpfExists = clientes.some(cliente => cliente.cpf === cpf)

    if (cpfExists) {
      alert('CPF/CNPJ já cadastrado!')
      return
    }

    // Encontra o maior ID existente
    const maxId = clientes.reduce((max, cliente) => Math.max(max, cliente.id || 0), 0)

    // Cria um novo cliente com um ID único
    const newClient = {
      id: maxId + 1,
      ...formData
    }

    // Adiciona o novo cliente
    clientes.push(newClient)

    // Salva novamente no localStorage
    localStorage.setItem('clientes', JSON.stringify(clientes))

    // Limpa o formulário após o cadastro
    setFormData({
      nome: '',
      cpf: '',
      observacoes: '',
      endereco: '',
      bairro: '',
      numero: '',
      email: '',
      telefone: '',
      complemento: ''
    })

    alert(`Paciente cadastrado com sucesso no id ${maxId + 1}`)
  }

  return (
    <ContainerGeral>
      <TitulosPrincipal>Cadastro de Pacientes</TitulosPrincipal>
      <form onSubmit={handleSubmit}>
        <Container>
          <Titulos>Dados Básicos</Titulos>  
          <Descricao>
            <Label>Nome: </Label>
            <Input type="text" name="nome" value={formData.nome} onChange={handleChange} required />
          </Descricao>
          <Descricao>
            <Label>CPF ou CNPJ: </Label>
            <Input type="text" name="cpf" value={formData.cpf} onChange={handleChange} required />
          </Descricao>
          <Descricao>
            <Label>Observações: </Label>
            <Input type="text" name="observacoes" value={formData.observacoes} onChange={handleChange} />
          </Descricao>
        </Container>
        <Container>
          <Titulos>Endereço</Titulos>
          <Descricao>
            <Label>Endereço: </Label>
            <Input type='text' name='endereco' value={formData.endereco} onChange={handleChange} required />
          </Descricao>
          <Descricao>
            <Label>Bairro: </Label>
            <Input type='text' name='bairro' value={formData.bairro} onChange={handleChange} required />
          </Descricao>
          <Descricao>
            <Label>Nº: </Label>
            <Input type='text' name='numero' value={formData.numero} onChange={handleChange} required />
          </Descricao>
          <Descricao>
            <Label>Complemento: </Label>
            <Input type='text' name='complemento' value={formData.complemento} onChange={handleChange} />
          </Descricao>
        </Container>
        <Container>
          <Titulos>Contatos</Titulos>
          <Descricao>
            <Label>Email: </Label>
            <Input type='email' name='email' value={formData.email} onChange={handleChange} required />
          </Descricao>
          <Descricao>
            <Label>Telefone: </Label>
            <Input type='text' name='telefone' value={formData.telefone} onChange={handleChange} required />
          </Descricao>
        </Container>
        <Button type="submit">Cadastrar</Button>
      </form>
    </ContainerGeral>
  )
}

export default CadastrarPacientes