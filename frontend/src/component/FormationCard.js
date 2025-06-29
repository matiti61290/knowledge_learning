import React, { useState, useEffect} from "react";
import { useAuth } from "../context/AuthContext";

function FormationCard ({ formation, isBought }) {
    const formationId = formation.id
    const { csrfToken } = useAuth()
    const [ certificationOk, setCertificationOk ] =useState(true)

    useEffect(() => {
        fetch(`http://localhost:3001/formations/certification/${formationId}`, {
            method: 'GET',
            credentials: 'include'
        })
        .then(async (response) => {
            if(!response.ok) {
                throw new Error(await response.text())
            }
            return response.text()
        })
        .then(() => {
            setCertificationOk(true)
        })
        .catch((error) => {
            console.error('Certification error:', error)
            setCertificationOk(false)
        })
    }, [formationId])

    async function handleBuy() {
        try{
            const res = await fetch(`http://localhost:3001/payment/create-checkout-session/formation/${formationId}`,{
                method: 'POST',
                credentials: 'include',
                headers: {
                    'x-csrf-token' : csrfToken,
                    'Content-Type': 'application/json'
                }
            })

            if(!res.ok){
                throw new Error('Errur lors de la creation de la session');
            }

            const data = await res.json()

            if(data.url) {
                window.location.href = data.url
            } else {
                console.error('pas d\'url de session retournee')
            }
        } catch(err) {
            console.error('Erreur:', err)
        }
    }

    return(
        <div className="card" style={{height: 15 +'em'}}>
            <div className="card-body">
                <h5 className="card-title">{formation.name}</h5>
                <p className="card-text fw-semibold">{formation.price} €</p>
                <div className="d-flex flex-column align-items-center">
                    {!isBought ? (
                        <>
                            <button className="btn btn-info my-1" onClick={() => handleBuy('formation', formationId)}>Acheter</button>
                            <a className="btn btn-light my-1" href={`/formations/${formation.id}`}>Plus de details</a>
                        </>
                    ) : (
                        <>
                            <a className="btn btn-info my-1" href={`/formations/${formation.id}`}>Accéder à la formation</a>
                            {certificationOk === true && 
                                <a className="btn btn-primary my-1" href={`certificate/${formationId}`}>Accéder à votre certificat</a>
                            }
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FormationCard