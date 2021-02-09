import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React from 'react'

export default function Home() {

  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  async function handleSubmit(e) {
    e.preventDefault()

    const rawResponse = await fetch('http://localhost:5000/auth/register', {       
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name, email, password})
      });
      const content = await rawResponse.json();
    
     
      document.querySelector("#login-form").style.display = "none";
      let div = document.createElement("div")
      div.style.textAlign = "center"
      div.style.fontSize = "2rem "
      div.innerHTML = content.message + "<span style='font-size:100px;'>&#128512;</span>"


      document.querySelector("#__next").appendChild(div)
  }

  return (
    <div>
      <Head>
        <title>Teste de Formulário</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Bem-vindo, faça seu cadastro
        </h1>

        <form id="login-form" action="#">
          <p>Nome</p>
          <input 
          value={name}
          onChange={(event) => setName(event.target.value)}
          name="name" 
          type="text"/>

          <p>Email</p>
          <input 
          onChange={(event) => setEmail(event.target.value)}          
          value={email} name="email" type="text"/>

          <p>Senha</p>
          <input 
          onChange={(event) => setPassword(event.target.value)}          
          value={password} 
          name="password" type="password"/>

          <p><button onClick={handleSubmit}>ENVIAR</button></p>
        </form>

      </main>
      
    </div>
  )
}
