import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LessonCard from "../component/LessonCard";

function Formation() {
    const { formationId } = useParams();
    const [formation, setFormation] = useState(null);
    const [lessons, setLessons] = useState([])
   

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/formations/${formationId}`, {
            method: 'GET',
            credentials: 'include'
        })
        .then(response => {
            if(!response.ok){
                throw new Error("erreur reseau")
            }
            return response.json()
        })
        .then(data => setFormation(data))
        .catch(error=> {
            console.error("erreur API:", error)
        })
    }, [formationId])

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/formations/${formationId}/lessons`, {
            method: 'GET',
            credentials: 'include'
        })
        .then(response => {
            if(!response.ok) {
                throw new Error("Erreur reseau")
            }
            return response.json()
        })
        .then(data => setLessons(data))
        .catch(error => {
            console.error("Erreur API:", error)
        })
    }, [formationId])

    if (!formation) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <h2>{formation.name}</h2>
                {lessons.map((lesson) => (
                    <div className="col-12 col-lg-6 my-5">
                        <LessonCard key={lesson.id} lesson={lesson} isBought={lesson.isBought} formationId={formationId} />
                    </div>
                ))}
            </div>
        </div>

    );
}

export default Formation;