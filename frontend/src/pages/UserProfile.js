import React, { useEffect, useState } from "react";

function UserProfile() {
    const [user, setUser] = useState(null)

    useEffect(() => {
        fetch('http://localhost:3001/user/', {
            method: 'GET',
            credentials: 'include'
        }).then(response => response.json())
        .then(data => setUser(data))
        .catch(error => console.error('Erreur API :', error ))
    }, [])
    console.log(user)
    if (!user) {
        return <div>Chargement...</div>;
    }

    return(
        <div className="container">
            <h1>Mon profil</h1>
            <div>
                <h3>Mes formations</h3>
                {user.purchases.map((purchase) => (
                    <div>
                        <a href={`/formations/${purchase.formation.id}`}>{purchase.formation.name}</a>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UserProfile