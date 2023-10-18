import React from 'react'
import { useState, useEffect } from 'react'
import StartPage from './components/StartPage/StartPage'
import QuizPage from './components/QuizPage/QuizPage'
// import DarkModeToggleButton from "./components/DarkModeToggleButton/DarkModeToggleButton"
import "./App.css"

export default function App() {
  const [apiData, setApiData] = useState([]) // Stores API data
  const [startScreen, setStartScreen] = useState(true) // Conditionally renders the startPage
  const [categoriesList, setCategoriesList] = useState([]) // Stores the list of trivia categories
  const [formData, setFormData] = useState({
    category: "",
    difficulty: "easy",
    amount: "5"
  }) // Stores user preferences


  // fetches the list of categories from the API, which is sent to startPage 
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://opentdb.com/api_category.php")
        if (!response.ok) {
          throw new Error("Could not reach the API")
        }
        const data = await response.json()
        setCategoriesList(data.trivia_categories)
      }

      catch (error) {
        console.error('An error occurred while processing data:', error)
      }
    }
    fetchCategories()
  },[])

  // fetches questions from the API based on queries managed by startPage
  useEffect(() => {
    const fetchData = async () => {
      try {
        let url = `https://opentdb.com/api.php?amount=${formData.amount}&difficulty=${formData.difficulty}`
        if (formData.category !== "") {
          url += `&category=${formData.category}`
        }
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Could not reach the API')
        }
  
        const data = await response.json()
        const shuffledData = data.results.map(question => {
          const shuffledAnswers = [question.correct_answer, ...question.incorrect_answers].sort(() => 0.5 - Math.random())
          // we keep the api data with spread, and add the shuffled answers
          return {
            ...question,
            answers: shuffledAnswers
          }
        })
        setApiData(shuffledData)
      } catch (error) {
        console.error('An error occurred while processing data:', error)
      }
    }
  
    fetchData()
  }, [formData])

    // Callback function to manage StartPage's form and update state
    function handleFormDataChange(newData) {
      console.log(newData)
      setFormData(newData)
    }

  return (
    <main>    
      {/* <DarkModeToggleButton /> */}
      {startScreen ?
        <StartPage 
          apiData={apiData}
          categoriesList={categoriesList}
          handleStart={()=> setStartScreen(prev => !prev)}  
          formData={formData}
          handleFormDataChange={handleFormDataChange}
        />
      :
        <QuizPage
          apiData={apiData}
          handleStart={()=> setStartScreen(prev => !prev)}
        />
      }
    </main>
  )
}

