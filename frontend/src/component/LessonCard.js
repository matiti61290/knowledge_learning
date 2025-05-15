import React from "react";

function LessonCard({ lesson, formationId }) {
    return(
        <div className="card">
            <div className="card-header">
                <h1>{lesson.title}</h1>
            </div>
            <div className="card-body">
                <h5>{lesson.price}</h5>
                <p className="card-text">{lesson.content}</p>
                <a href={`/formations/${formationId}/${lesson.id}`}>Plus de details</a>
            </div>
        </div>
    )
}

export default LessonCard