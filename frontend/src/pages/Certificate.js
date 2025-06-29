import React, { useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Certificate() {
    const [certificate, setCertificate] = useState(null)
    const [user, setUser] = useState(null)
    const {formationId} = useParams()
    const { csrfToken } = useAuth()

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/formations/certification/${formationId}`,{
            method: 'GET',
            credentials: 'include',
            headers: {
                    'x-csrf-token' : csrfToken,
                    'Content-Type': 'application/json'
                }
        })
        .then(response => {
            if(!response.ok){
                throw new Error("Erreur reseau")
            }
            return response.json()
        })
        .then(data => setCertificate(data))
        .catch(error => {
            console.error("Erreur API:", error)
        })
    }, [formationId])

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/user/`, {
            method: 'GET',
            credentials: 'include'
        }).then(response => response.json())
        .then(data => setUser(data))
        .catch(error => console.error('Erreur API :', error ))
    }, [])

    if (!user || !certificate) {
        return <div>Chargement du certificat...</div>
    }
    
    return(
        <div className="container d-flex flex-column align-items-center mt-5">
            <h1>Certificat de réussite</h1>
            <p>Ce certificat atteste que</p>
            <p>{user.firstname} {user.lastname}</p>
            <p>a complété la formation. {certificate.formation.name}</p> 
        </div>
    )
}

export default Certificate