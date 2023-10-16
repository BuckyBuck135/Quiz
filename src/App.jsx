import React from 'react'
import StartPage from './components/StartPage/StartPage'
import QuizPage from './components/QuizPage/QuizPage'
// import DarkModeToggleButton from "./components/DarkModeToggleButton/DarkModeToggleButton"
import "./App.css"

export default function App() {

  const [startScreen, setStartScreen] = React.useState(true)

  return (
    <main>    
      {/* <DarkModeToggleButton /> */}
      {startScreen ?
        <StartPage 
          handleChange={()=> setStartScreen(prev => !prev)}  
        />
      :
        <QuizPage
          handleChange={()=> setStartScreen(prev => !prev)}
        />
      }
    </main>
  )
}

