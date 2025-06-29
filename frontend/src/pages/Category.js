import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormationCard from "../component/FormationCard";

function Category() {
    const { categoryId } = useParams();
    const [formationsByCategory, setFormationsByCategory] = useState([]);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/formations/category/${categoryId}`, {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erreur réseau");
                }
                return response.json();
            })
            .then(data => {
                setFormationsByCategory(data);
            })
            .catch(error => console.error("Erreur API :", error));
    }, [categoryId]); 
    console.log("les formations sont: ", formationsByCategory)

    return (
        <div className="container mt-5">
            <h2>Nos formations</h2>
            <div className="container">
                <div className="row d-flex justify-content-center">
                    {formationsByCategory.map((formation) => (
                        <div className="col-12 col-lg-4 col-md-6 my-5">
                            <FormationCard key={formation.id} formation={formation} isBought={formation.isBought}/>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Category