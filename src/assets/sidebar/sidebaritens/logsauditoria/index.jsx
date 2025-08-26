import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  padding: 20px;
  margin-left: 220px; /* Espaço para a Sidebar */
  color: #000;
`

const Title = styled.h2`
  margin-bottom: 20px;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: #fff;
`

const Th = styled.th`
  background-color: #254b9eff;
  color: white;
  padding: 10px;
  text-align: left;
  border: 1px solid #ccc;
`

const Td = styled.td`
  padding: 8px;
  border: 1px solid #ccc;
`

export default function LogsAuditoria() {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    const registros = JSON.parse(localStorage.getItem('logsAuditoria')) || []
    setLogs(registros.reverse()) // mostra mais recentes primeiro
  }, [])

  return (
    <Container>
      <Title>📜 Logs e Auditoria</Title>
      <Table>
        <thead>
          <tr>
            <Th>Data/Hora</Th>
            <Th>Usuário</Th>
            <Th>Ação</Th>
          </tr>
        </thead>
        <tbody>
          {logs.length === 0 ? (
            <tr>
              <Td colSpan="3">Nenhum registro encontrado.</Td>
            </tr>
          ) : (
            logs.map((log, index) => (
              <tr key={index}>
                <Td>{log.data}</Td>
                <Td>{log.usuario}</Td>
                <Td>{log.acao}</Td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </Container>
  )
}

