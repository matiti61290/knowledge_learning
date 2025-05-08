import React, {useState, useEffect} from "react";

function Home() {
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
            <ul>
                {formations.map((formation) => (
                    <li key={formation.id}>
                        <h3>{formation.name}</h3>
                        <h4>{formation.price}</h4>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Home;