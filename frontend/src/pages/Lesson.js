import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Lesson ( ) {
    const [lesson, setLesson] = useState(null)
    const {formationId, lessonId} = useParams()
    const { csrfToken } = useAuth()
    const navigate = useNavigate()

    console.log(lessonId)

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/formations/${formationId}/${lessonId}`, {
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

    // async function validateLesson(id){
    //     try{
    //         fetch(`${process.env.REACT_APP_BACKEND_URL}/formations/validate/${id}`,{
    //             method: 'POST',
    //             credentials: "include",
    //             headers: {
    //                 'x-csrf-token': csrfToken,
    //                 'Content-Type' : 'application/json'
    //             }
    //         })
    //     } catch (error) {
    //         console.error('Erreur:', error)
    //     }
    // }

    async function validateLesson(id) {
        console.log("validateLesson called with ID:", id, "type:", typeof id);

        try {
            const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/formations/validate/${id}`, {
                method: 'POST',
                credentials: "include",
                headers: {
                    'x-csrf-token': csrfToken,
                    'Content-Type' : 'application/json'
                }
            })

            if(res.ok){
                navigate(`/formations/${formationId}`, { replace: true });

            }

        } catch (error) {
            console.error('Erreur:', error)
        }
    }

    if (!lesson) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="container mb-5">
            <h1 className="mt-5 fw-bold text-decoration-underline">{lesson.title}</h1>
            <div className="d-flex flex-column align-items-center">
                <div className="my-4">
                    <video width={640} height={360} controls>
                        <source src={lesson.url_video} type="video/mp4" />
                    </video>
                </div>
                <p>{lesson.content}</p>
                <button type="button" className="btn btn-primary" onClick={()=> validateLesson(lesson.id)}>Finir la lecon</button>
            </div>
        </div>
    )
}

export default Lesson