import React from "react";

function LessonCard({ lesson, formationId }) {
    return(
        <div className="card">
            <div className="card-header bg-info-subtle">
                <h3>{lesson.title}</h3>
            </div>
            <div className="card-body">
                <h5>{lesson.price}</h5>
                <p className="card-text text-truncate text-break d-block" >{lesson.content}</p>
                <a href={`/formations/${formationId}/${lesson.id}`}>Plus de details</a>
            </div>
        </div>
    )
}

export default LessonCard