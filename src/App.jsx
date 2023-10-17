import React from 'react'
import { useState, useEffect } from 'react'
import StartPage from './components/StartPage/StartPage'
import QuizPage from './components/QuizPage/QuizPage'
// import DarkModeToggleButton from "./components/DarkModeToggleButton/DarkModeToggleButton"
import "./App.css"

export default function App() {
  const [apiData, setApiData] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [startScreen, setStartScreen] = useState(true)

  // fetches the list of categories from the API, which is sent to startPage 
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("https://opentdb.com/api_category.php")
        if (!response.ok) {
          throw new Error("Could not reach the API")
        }
        const data = await response.json()
        setCategoryData(data.trivia_categories)
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
        const response = await fetch("https://opentdb.com/api.php?amount=2&category=21&difficulty=easy");
        if (!response.ok) {
          throw new Error('Could not reach the API')
        }
  
        const data = await response.json()
        const shuffledData = data.results.map(question => {
          const shuffledAnswers = [question.correct_answer, ...question.incorrect_answers].sort(() => 0.5 - Math.random())
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
  }, [])

  return (
    <main>    
      {/* <DarkModeToggleButton /> */}
      {startScreen ?
        <StartPage 
          apiData={apiData}
          categoryData={categoryData}
          handleChange={()=> setStartScreen(prev => !prev)}  
        />
      :
        <QuizPage
          apiData={apiData}
          handleChange={()=> setStartScreen(prev => !prev)}
        />
      }
    </main>
  )
}

