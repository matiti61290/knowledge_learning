import React, { useEffect, useState } from "react";

function UserProfile() {
    const [user, setUser] = useState(null)
    const [certificationOk, setCertificationOk] = useState(true)

    useEffect(() => {
        fetch('http://localhost:3001/user/', {
            method: 'GET',
            credentials: 'include'
        }).then(response => response.json())
        .then(data => setUser(data))
        .catch(error => console.error('Erreur API :', error ))
    }, [])

    async function getCertificate(id){
        try{
            fetch(`http://localhost:3001/formations/certification/${id}`, {
                method: 'GET',
                credentials: 'include'
            })
            .then(async (response) => {
                if(!response.ok) {
                    throw new Error(await response.text())
                }
                return response.text()
            })
            .then(() => {
                setCertificationOk(true)
            })
            .catch((error) => {
                console.error('Certification error:', error)
                setCertificationOk(false)
            })
        } catch(error){
            console.log(error)
        }
        
    }
    
    
    if (!user) {
        return <div>Chargement...</div>;
    }

    return(
        <div className="container my-5">
            <h1>Bienvenue {user.firstname} {user.lastname}</h1>
            <div className="container my-5 py-4 border ">
                <h3 className="pb-2">Mes formations</h3>
                <div >
                    {user.purchases.map((purchase) => (
                        <div className="my-2 d-flex flex-row justify-content-evenly align-items-center border-top border-bottom">
                        <a className="link-underline link-underline-opacity-0" href={`/formations/${purchase.formation.id}`}>{purchase.formation.name}</a>
                        {certificationOk === true &&
                            <button className="btn btn-primary my-1" onClick={() => getCertificate(purchase.formation.id)}>Acceder a votre certificat</button>
                        }
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default UserProfile