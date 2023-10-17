import React from "react"
import { useState, useEffect } from 'react'

export default function StartPage( {categoryData, handleChange} ) {

  const [formData, setFormData] = useState({
    category: "20",
    difficulty: "easy",
    amount: 5
  })
  
  // const datalist_options = categoryData.map(category => (
  //   <option key={category.id} value={category.id}>{category.name}</option>
  // ))

  const select_options = categoryData.map(category => (<option key={category.id} value={category.id}>{category.name}</option>))
  
  return (
      <section className="start-section">
        <h1>QUIZZICAL</h1>
        <form>
          <fieldset>
            <legend>QUIZZICAL</legend>

            {/* <input list="options" />
            <datalist id="options">
              {datalist_options}
            </datalist> */}

            <label htmlFor="category-select">Choose a category:</label>
            <select name="category-select" id="category-select">
              <option value="">Give me random!</option>
              {select_options}
            </select>
          </fieldset>
        </form>
        <button className="btn btn-primary" onClick={handleChange}>START GAME</button>
      </section>
  )
}



// {id: 17, name: 'Science & Nature'}