import React, { useState } from "react";

function Register() {
    const [firstname, setFirstname] = useState('')
    const [lastname, setLastname] = useState('')
    const [mail, setMail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [message, setMessage] = useState('')

    const handleSubmit = async(e) => {
        e.preventDefault()
    

        try{
            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ firstname, lastname, mail, password, confirmPassword})
            })

            if (response.ok) {
                const data = await response.json()
                setMessage(`Votre inscription est prise en compte ${data.firstname || 'utilisateur'}. Merci de confirmer votre mail`)
            } else {
                const errorData = await response.json()
                setMessage( errorData.message || 'Erreur de connexion')
            }
        } catch (error){
            setMessage('Erreur reseau ou serveur')
            console.error(error)
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h2>Inscription</h2>
            <div>
                <label>Prenom</label>
                <input type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} required />
            </div>
            <div>
                <label>Nom</label>
                <input type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} required />
            </div>
            <div>
                <label>Email</label>
                <input type="mail" value={mail} onChange={(e) => setMail(e.target.value)} required />
            </div>
            <div>
                <label>Mot de passe</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div>
                <label>Confirmer le mot de passe</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
            <button type="submit">S'inscrire</button>
            <p>{message}</p>
        </form>
    )
}

export default Register