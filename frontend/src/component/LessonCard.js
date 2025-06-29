import React from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function LessonCard({ lesson, formationId, isBought }) {
    const lessonId = lesson.id
    const { csrfToken } = useAuth()

    async function handleBuy(type, id){
        try{
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/payment/create-checkout-session/lesson/${lessonId}`,{
                method: 'POST',
                credentials: 'include',
                headers: {
                    'x-csrf-token': csrfToken,
                    'Content-Type': 'application/json'
                }
            })

            if(!res.ok){
                throw new Error('Erreur lors de la creation de la session');
            }

            const data = await res.json()

            if (data.url) {
                window.location.href = data.url
            } else {
                console.error('Pas d\'url de session retournee')
            }
        } catch(err) {
            console.error('Erreur: ', err)
        }
    }

    return(
        <div className="card">
            <div className="card-header bg-info-subtle">
                <h3 className="card-title">{lesson.title}</h3>
            </div>
            <div className="card-body">
                <p className="card-text fw-semibold">{lesson.price} €</p>
                {!isBought ? (
                    <button className="btn btn-info my-1" onClick={() => handleBuy('lesson', lessonId)}>Acheter</button>
                    ) : (
                    <Link className="btn btn-primary my-1" to={`/formations/${formationId}/${lessonId}`}>Commencer la leçon</Link>
                )}
            </div>
        </div>
    )
}

export default LessonCard