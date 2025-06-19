import React from "react";
import { useAuth } from "../context/AuthContext";

function LessonCard({ lesson, formationId, isBought }) {
    const lessonId = lesson.id
    const { csrfToken } = useAuth()

    async function handleBuy(type, id){
        try{
            const res = await fetch(`http://localhost:3001/payment/create-checkout-session/lesson/${lessonId}`,{
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
                <h3>{lesson.title}</h3>
            </div>
            <div className="card-body">
                <h5>{lesson.price}</h5>
                <p className="card-text text-truncate text-break d-block" >{lesson.content}</p>
                {!isBought ? (
                    <>
                        <button onClick={() => handleBuy('lesson', lessonId)}>Acheter</button>
                    </> 
                ): (
                    <>
                        <a href={`/formations/${formationId}/${lessonId}`}>Commencer la lecon</a>
                    </>
                )}
            </div>
        </div>
    )
}

export default LessonCard