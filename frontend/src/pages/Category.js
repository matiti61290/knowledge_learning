import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormationCard from "../component/FormationCard";

function Category() {
    const { categoryId } = useParams();
    const [formationsByCategory, setFormationsByCategory] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3001/formations/category/${categoryId}`, {
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

    return (
        <div>
            <h2>Les formations</h2>
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