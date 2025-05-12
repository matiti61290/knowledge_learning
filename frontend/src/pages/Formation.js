import React, { useEffect, useState} from "react";
import { useParams } from "react-router-dom";

function Formation() {
    const { formationId } = useParams()
    const [formation, setFormation] = useState()

    useEffect(() => {
        fetch(`http://localhost:3001/formations/${formationId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Erreur reseau")
            }
            return response.json()
        }).then(data => {
            setFormation(data)
        })
        .catch(error => console.error("Erreur API:", error))
    }, [formationId])

    console.log(formation)

    return(
        <h1>{formation.name}</h1>
    )
}

export default Formation