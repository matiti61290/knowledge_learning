import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FormationCard from "../component/FormationCard";

function Category() {
    const { categoryId } = useParams();
    const [formationsByCategory, setFormationsByCategory] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3001/formations/category/${categoryId}`)
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
                {formationsByCategory.map((formation) => (
                    <FormationCard key={formation.id} formation={formation} />
                ))}
        </div>
    );
}

export default Category