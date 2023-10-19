import React from 'react'
import { useState, useEffect } from 'react'
import * as ReactDOM from 'react-dom';
import { DarkModeSwitch } from 'react-toggle-dark-mode'
import StartPage from './components/StartPage/StartPage'
import QuizPage from './components/QuizPage/QuizPage'
import "./App.css"

export default function App() {
  const [isDarkMode, setDarkMode] = React.useState(false);
  const [apiData, setApiData] = useState([]) // Stores API data
  const [startScreen, setStartScreen] = useState(true) // Conditionally renders the startPage
  const [categoriesList, setCategoriesList] = useState([]) // Stores the list of trivia categories
  const [formData, setFormData] = useState({
    category: "",
    difficulty: "easy",
    amount: "5"
  }) // Stores quiz settings


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

  // calls fetchData() with a setTimeout debouncing to avoid too many requests caused by the number of questions range input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchData()
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [formData])

  // fetches questions from the API based on queries managed by startPage
  async function fetchData() {
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

  // Callback function to manage StartPage's form and update state
  function handleFormDataChange(newData) {
    setFormData(newData)
  }

  // Managin darkmode - sets stored mode on load
  useEffect(() => {
    const storedDarkMode = localStorage.getItem('darkMode');
    if (storedDarkMode === 'enabled') {
      setDarkMode(true);
    }
  }, []);

  function toggleDarkMode(checked) {
    if (isDarkMode) {
      setDarkMode(checked)
      localStorage.setItem('darkMode', null);
    } else {
      setDarkMode(checked)
      localStorage.setItem('darkMode', 'enabled');
    }
  }

  return (
    <>
      <div className={`container ${isDarkMode ? "darkmode" : ""}`}>
      <div className="shape-blob"></div>
      <div className="shape-blob one"></div>
      <div className="shape-blob two"></div>
      <main>    
        <DarkModeSwitch
          className="dark-mode-switch"
          aria-label="dark-mode-switch"
          checked={isDarkMode}
          onChange={toggleDarkMode}
          size={30}
          moonColor="var(--foreground)"
          sunColor="var(--foreground)"
        />
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
      </div>
    </>
  )
}

