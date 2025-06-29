import React from "react";
import { Link } from "react-router-dom";

function pageNotFound() {
    return (
        <div className="container d-flex flex-column align-items-center mt-5">
            <h1 className="mb-3">Oups! Cette page n'existe pas!</h1>
            <Link to={"/"} className="btn btn-primary">Retourner à la page d'accueil.</Link>
        </div>
    )
}

export default pageNotFound