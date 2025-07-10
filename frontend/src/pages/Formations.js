import React, {useState, useEffect} from "react"
import FormationCard from "../component/FormationCard"

function Formations () {
    const [formations, setFormations] = useState([])

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/formations`, {
            method: 'GET',
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => setFormations(data))
        .catch(error => console.error('Erreur API :', error))
    }, [])

    if(!formations){
        return <div>Chargement...</div>;
    }
    
    return (
        <div className="container mt-5">
            <h2>Nos formations</h2>
            <div className="container">
                <div className="row">
                    {formations.map((formation) => (
                        <div className="col-12 col-lg-4 col-md-6 my-5">
                            <FormationCard key={formation.id} formation={formation} isBought={formation.isBought}/>
                        </div>
                    ))}
                </div>
                
            </div>
        </div>
    )
}

export default Formations