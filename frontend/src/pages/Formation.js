import React, { useEffect, useState} from "react";

function Formation() {
        const [formation, setFormation] = useState([])
    
        useEffect(() => {
            fetch('http://localhost:3001/formations/1', {
                method: 'GET',
                credentials: 'include'
            })
            .then(response => response.json())
            .then(data => setFormation(data))
            .catch(error => console.error('Erreur API :', error))
        }, [])

    return (
        <h1>{formation.name}</h1>
    )
}

export default Formation