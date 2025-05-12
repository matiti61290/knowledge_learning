import React from "react";

function FormationCard ({ formation }) {
    return(
        <div className="card">
            <div className="card-body">
                <h5 className="card-title">{formation.name}</h5>
                <p className="card-text">{formation.price}</p>
                <a href={`/formations/${formation.id}`}>Plus de details</a>
            </div>
        </div>
    )
}

export default FormationCard