import React, {useState, useEffect} from "react"
import FormationCard from "../component/FormationCard"

function Formations () {
    const [formations, setFormations] = useState([])

    useEffect(() => {
        fetch('http://localhost:3001/formations', {
            method: 'GET',
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => setFormations(data))
        .catch(error => console.error('Erreur API :', error))
    }, [])
    
    return (
        <div>
            <h2>Formations</h2>
                {formations.map((formation) => (
                    <FormationCard key={formation.id} formation={formation} />
                ))}
        </div>
    )
}

export default Formations