import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Category() {
    const { categoryId } = useParams(); // ✅ Déstructuration correcte
    const [formationsByCategory, setFormationsByCategory] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3001/formations/category/${categoryId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Erreur réseau");
                }
                return response.json(); // ✅ On parse le JSON ici
            })
            .then(data => {
                setFormationsByCategory(data); // ✅ data = tableau attendu
            })
            .catch(error => console.error("Erreur API :", error));
    }, [categoryId]); // ✅ Mettre categoryId en dépendance si on change de route

    return (
        <div>
            <h2>Les formations</h2>
            <ul>
                {formationsByCategory.map((formation) => (
                    <li key={formation.id}>
                        <h3>{formation.name}</h3>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Category