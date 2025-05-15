import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Lesson ( ) {
    const [lesson, setLesson] = useState(null)
    const {formationId, lessonId} = useParams()

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

    console.log(lesson)

    if (!lesson) {
        return <div>Chargement...</div>;
    }

    return (
        <div>
            <h1>{lesson.title}</h1>
        </div>
    )
}

export default Lesson