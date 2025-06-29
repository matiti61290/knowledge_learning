import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// function UserProfile() {
//     const [user, setUser] = useState(null)
//     const [certificationOk, setCertificationOk] = useState(true)

//     useEffect(() => {
//         fetch(`${process.env.REACT_APP_BACKEND_URL}/user/`, {
//             method: 'GET',
//             credentials: 'include'
//         }).then(response => response.json())
//         .then(data => setUser(data))
//         .catch(error => console.error('Erreur API :', error ))
//     }, [])

//     async function getCertificate(id){
//         try{
//             fetch(`${process.env.REACT_APP_BACKEND_URL}/formations/certification/${id}`, {
//                 method: 'GET',
//                 credentials: 'include'
//             })
//             .then(async (response) => {
//                 if(!response.ok) {
//                     throw new Error(await response.text())
//                 }
//                 return response.text()
//             })
//             .then(() => {
//                 setCertificationOk(true)
//             })
//             .catch((error) => {
//                 console.error('Certification error:', error)
//                 setCertificationOk(false)
//             })
//         } catch(error){
//             console.log(error)
//         }
        
//     }
    
    
//     if (!user) {
//         return <div>Chargement...</div>;
//     }

//     return(
//         <div className="container my-5">
//             <h1>Bienvenue {user.firstname} {user.lastname}</h1>
//             <div className="container my-5 py-4 border ">
//                 <h3 className="pb-2">Mes formations</h3>
//                 <div >
//                     {user.purchases.map((purchase) => (
//                         <div className="my-2 d-flex flex-row justify-content-evenly align-items-center border-top border-bottom">
//                         <Link className="link-underline link-underline-opacity-0" to={`/formations/${purchase.formation.id}`}>{purchase.formation.name}</Link>
//                         {certificationOk === true &&
//                             <button className="btn btn-primary my-1" onClick={() => getCertificate(purchase.formation.id)}>Accéder à votre certificat</button>
//                         }
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default UserProfile
function UserProfile() {
  const [user, setUser] = useState(null)
  // Certification par formation, ex: { 1: true, 2: false }
  const [certificationStatus, setCertificationStatus] = useState({})

  useEffect(() => {
    fetch(`${process.env.REACT_APP_BACKEND_URL}/user/`, {
      method: 'GET',
      credentials: 'include'
    })
      .then(response => response.json())
      .then(data => setUser(data))
      .catch(error => console.error('Erreur API :', error))
  }, [])

  async function getCertificate(id) {
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/formations/certification/${id}`, {
        method: 'GET',
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error(await response.text())
      }

      // Met à jour l’état en indiquant que la certification est OK pour cette formation
      setCertificationStatus(prev => ({ ...prev, [id]: true }))
    } catch (error) {
      console.error('Certification error:', error)
      // Met à jour l’état en indiquant que la certification n’est pas OK
      setCertificationStatus(prev => ({ ...prev, [id]: false }))
    }
  }

  if (!user) {
    return <div>Chargement...</div>
  }

  return (
    <div className="container my-5">
      <h1>Bienvenue {user.firstname} {user.lastname}</h1>
      <div className="container my-5 py-4 border ">
        <h3 className="pb-2">Mes formations</h3>
        <div>
          {user.purchases.map((purchase) => (
            <div
              key={purchase.formation.id}
              className="my-2 d-flex flex-row justify-content-evenly align-items-center border-top border-bottom"
            >
              <Link
                className="link-underline link-underline-opacity-0"
                to={`/formations/${purchase.formation.id}`}
              >
                {purchase.formation.name}
              </Link>

              {/* Affiche le bouton seulement si la certification est OK pour cette formation */}
              {certificationStatus[purchase.formation.id] === true && (
                <Link
                  className="btn btn-primary my-1"
                  to={`/formations/certification/${purchase.formation.id}`}
                >
                  Accéder à votre certificat
                </Link>
              )}

              {/* Sinon, affiche un bouton pour tester la certification */}
              {certificationStatus[purchase.formation.id] !== true && (
                <button
                  className="btn btn-secondary my-1"
                  onClick={() => getCertificate(purchase.formation.id)}
                >
                  Vérifier certificat
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default UserProfile