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
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/register`, {
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
        <div className="container d-flex justify-content-center mt-5 py-2 border" style={{width: 40 + 'em' }}>
            <form onSubmit={handleSubmit}>
                <h2>Inscription</h2>
                <div className="d-flex flex-column my-3">
                    <label>Prénom</label>
                    <input style={{width: 20 + 'em'}} type="text" value={firstname} onChange={(e) => setFirstname(e.target.value)} required />
                </div>
                <div className="d-flex flex-column my-3">
                    <label >Nom</label>
                    <input style={{width: 20 + 'em'}} type="text" value={lastname} onChange={(e) => setLastname(e.target.value)} required />
                </div>
                <div className="d-flex flex-column my-3">
                    <label>Email</label>
                    <input style={{width: 20 + 'em'}} type="mail" value={mail} onChange={(e) => setMail(e.target.value)} required />
                </div>
                <div className="d-flex flex-column my-3">
                    <label>Mot de passe</label>
                    <input style={{width: 20 + 'em'}} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div className="d-flex flex-column my-3">
                    <label>Confirmer le mot de passe</label>
                    <input style={{width: 20 + 'em'}} type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
                <button className="btn btn-secondary" type="submit">S'inscrire</button>
                <p className="mt-3">{message}</p>
            </form>
        </div>
    )
}

export default Register