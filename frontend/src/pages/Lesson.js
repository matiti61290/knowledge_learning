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

    if (!lesson) {
        return <div>Chargement...</div>;
    }

    return (
        <div>
            <h1>{lesson.title}</h1>
            <div>
                {lesson.url_video === "undefined" ? (
                    <video width={640} height={360} controls>
                        <source src={lesson.url_video} type="video/mp4" />
                    </video>
                ) : (
                    <pa>Ya une video</pa>
                )}
                <p>{lesson.content}</p>
            </div>
        </div>
    )
}

export default Lesson