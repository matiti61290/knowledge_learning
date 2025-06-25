import React from "react";

function pageNotFound() {
    return (
        <div className="container d-flex flex-column align-items-center mt-5">
            <h1 className="mb-3">Oups! Cette page n'existe pas!</h1>
            <a href={"/"} className="btn btn-primary">Retourner a la page d'accueil</a>
        </div>
    )
}

export default pageNotFound