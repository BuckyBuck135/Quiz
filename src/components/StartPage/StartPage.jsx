import React from "react"
import "./StartPage.css"

export default function StartPage( {categoriesList, handleStart, formData, handleFormDataChange } ) {

  function handleForm(event) {
    const {name, value} = event.target
    const newFormData = {
      ...formData,
      [name]: value
    }
    // calling the callback prop to update the state in parent
    handleFormDataChange(newFormData)
  }

  return (
      <section className="start-section flex column gap2 ">
        <h1>QUI<span className="clr-correct">Z</span><span className="clr-incorrect">Z</span>ICAL</h1>
        <form>
          <fieldset>
            <legend>CATEGORY</legend>
            <label htmlFor="category-select">Select category:</label>
            <select value={formData.category} name="category" onChange={handleForm} id="category-select">
              <option value="">Give me random!</option>
              {categoriesList.map(category => (<option key={category.id} value={category.id}>{category.name}</option>))}
            </select>
          </fieldset>

          <fieldset>
            <legend>DIFFICULTY</legend>
            <label htmlFor="difficulty-select">Select difficulty:</label>
            <select value={formData.difficulty} name="difficulty" onChange={handleForm} id="difficulty-select">
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </fieldset>

          <fieldset>
            <legend>NUMBER OF QUESTIONS</legend>
            <label htmlFor="amount-select">Number of questions:</label>
            <div className="flex gap1">
              <input type="range" min="5" max="50" value={formData.amount} name="amount" onChange={handleForm} id="amount-select" />
              <span>{formData.amount}</span>
            </div>
          </fieldset>

        </form>
        <button className="btn btn-primary" onClick={handleStart}>START GAME</button>
      </section>
  )
}
