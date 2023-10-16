import React from "react"

export default function StartPage(props) {
    return (
        <section className="start-section">
          <h1>QUIZZICAL</h1>
          <button className="btn btn-primary" onClick={props.handleChange}>START GAME</button>
        </section>
    )
}