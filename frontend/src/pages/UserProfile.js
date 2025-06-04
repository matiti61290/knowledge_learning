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
        <div>
            <h1>La page marche</h1>
            <h2> et on a meme le mail: {user.mail}</h2>
        </div>
    )

}

export default UserProfile