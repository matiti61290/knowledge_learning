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

    console.log(formations)
    
    return (
        <div>
            <h2>Formations</h2>
            <div className="container">
                <div className="row">
                    {formations.map((formation) => (
                        <div className="col-12 col-lg-4 col-md-6 my-5">
                            <FormationCard key={formation.id} formation={formation} />
                        </div>
                    ))}
                </div>
                
            </div>
        </div>
    )
}

export default Formations