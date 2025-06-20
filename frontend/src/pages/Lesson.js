import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Lesson ( ) {
    const [lesson, setLesson] = useState(null)
    const {formationId, lessonId} = useParams()
    const { csrfToken } = useAuth()

    useEffect(() => {
        fetch(`http://localhost:3001/formations/${formationId}/${lessonId}`, {
            method: 'GET',
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur reseau")
            }
            return response.json()
        })
        .then(data => setLesson(data))
        .catch(error => {
            console.error("Erreur API:", error)
        });
    }, [formationId, lessonId])

    async function validateLesson(id){
        try{
            const res = await fetch(`http://localhost:3001/formations/validate/${lessonId}`,{
                method: 'POST',
                credentials: "include",
                headers: {
                    'x-csrf-token': csrfToken,
                    'Content-Type' : 'application/json'
                }
            })
        } catch (error) {
            console.error('Erreur:', error)
        }
    }

    if (!lesson) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="container">
            <h1 className="mt-5 fw-bold text-decoration-underline">{lesson.title}</h1>
            <div className="d-flex flex-column align-items-center">
                <div className="my-4">
                    <video width={640} height={360} controls>
                        <source src={lesson.url_video} type="video/mp4" />
                    </video>
                </div>
                <p>{lesson.content}</p>
                <button onClick={()=> validateLesson(lessonId)}>Servira a valider la lecon</button>
            </div>
        </div>
    )
}

export default Lesson