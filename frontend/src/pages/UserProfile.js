import React, { useEffect, useState} from "react";

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

    return <h1>{user.mail}</h1>
}

export default UserProfile