import React, {useState} from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function Login () {
    const [mail, setMail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')
    const navigate = useNavigate()
    const { checkLoginStatus } = useAuth()
    
    const handleSubmit = async (e) => {
      e.preventDefault()
    
      try{
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/login`, {
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({mail, password})
        });
    
        if(response.ok) {
          const data = await response.json()
          setMessage(`Bienvenue ${data.username || 'utilisateur'} ! le login fonctionne!`)
          await checkLoginStatus()
          navigate('/')
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
      <div className="container d-flex justify-content-center mt-5 py-2 border" style={{width: 40 + 'em' }}>
        <form onSubmit={handleSubmit}>
          <h2>Connexion</h2>
          <div className="d-flex flex-column my-3">
            <label>Email: </label>
            <input style={{width: 20 + 'em'}} type="mail" value={mail} onChange={(e) => setMail(e.target.value)} required />
          </div>
          <div className="d-flex flex-column my-3">
            <label>Mot de passe: </label>
            <input style={{width: 20 + 'em'}} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="d-flex flex-row justify-content-between">
            <button className="btn btn-primary" type="submit">Se connecter</button>
            <Link to={'/register'} className="btn btn-secondary">Pas encore inscrit?</Link>
          </div>
          
          <p className="mt-3">{message}</p>
      </form>
      </div>

    )
}

export default Login