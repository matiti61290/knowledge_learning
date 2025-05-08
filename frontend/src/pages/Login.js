import React, {useState} from "react"

function Login () {
    const [mail, setMail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    
    const handleSubmit = async (e) => {
      e.preventDefault()
    
      try{
        const response = await fetch('http://localhost:3001/login', {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({mail, password})
        });
    
        if( response.ok) {
          const data = await response.json()
          setMessage(`Bienvenue ${data.username || 'utilisateur'} ! le login fonctionne!`)
        } else {
          const errorData = await response.json()
          setMessage(errorData.message || 'Erreur de connexion')
        }
      } catch (error) {
        setMessage('Erreur reseau ou serveur')
        console.error(error)
      }
    }
    
    return (
      <form onSubmit={handleSubmit}>
        <h2>Connexion</h2>
        <div>
          <label>Email: </label>
          <input type="mail" value={mail} onChange={(e) => setMail(e.target.value)} required />
        </div>
        <div>
          <label>Mot de passe: </label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit">Se connecter</button>
        <p>{message}</p>
      </form>
    )
}

export default Login