import React, { useState } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #ffffffff;
  color: white;
`

const FormBox = styled.div`
  background-color: #1e1e1e;
  padding: 30px;
  border-radius: 10px;
  width: 300px;
`

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  background-color: #333;
  color: white;
  border: 1px solid #555;
`

const Button = styled.button`
  width: 100%;
  padding: 10px;
  margin-top: 20px;
  background-color: #007bff;
  border: none;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`

const ToggleText = styled.p`
  margin-top: 10px;
  font-size: 14px;
  cursor: pointer;
  text-align: center;
  color: #ccc;

  &:hover {
    text-decoration: underline;
  }
`

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [modoCadastro, setModoCadastro] = useState(false)

  const handleLoginOuCadastro = () => {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || []

    if (modoCadastro) {
      if (usuarios.find(u => u.email === email)) {
        alert('Usuário já existe!')
        return
      }
      usuarios.push({ email, senha })
      localStorage.setItem('usuarios', JSON.stringify(usuarios))
      alert('Cadastro realizado com sucesso!')
      setModoCadastro(false)
    } else {
      const usuario = usuarios.find(u => u.email === email && u.senha === senha)
      if (usuario) {
        localStorage.setItem('usuarioLogado', JSON.stringify(usuario))
        navigate('/home')
      } else {
        alert('Usuário ou senha inválidos!')
      }
    }
  }

  return (
    <Container>
      <FormBox>
        <h2>{modoCadastro ? 'Cadastro' : 'Login'}</h2>
        <Input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <Input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} />
        <Button onClick={handleLoginOuCadastro}>{modoCadastro ? 'Cadastrar' : 'Entrar'}</Button>

        <ToggleText onClick={() => setModoCadastro(!modoCadastro)}>
          {modoCadastro ? 'Já tem conta? Faça login' : 'Não tem conta? Cadastre-se'}
        </ToggleText>
      </FormBox>
    </Container>
  )
}

export default Login
