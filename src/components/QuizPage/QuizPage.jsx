import React from "react"
import { useState, useEffect } from 'react'
import "./QuizPage.css"
import { decode } from "he"
import Confetti from 'react-confetti'
import { v4 as uuidv4 } from 'uuid'

export default function QuizPage(props) {
  const [apiData, setApiData] = useState([])
  const [selectedAnswers, setSelectedAnswers] = useState([])
  const [finalAnswersArray, setFinalAnswersArray] = useState([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [areAnswersComplete, setAreAnswersComplete] = useState(false)

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
    };
  
    fetchData();
  }, [])
  

  // Initialize the selectedAnswers array with null values for each question
  useEffect(() => {
    setSelectedAnswers(Array.from({length: apiData.length}))
  }, [apiData])

  
  // Checks if all questions have been answered
  useEffect(() => {
    setAreAnswersComplete(selectedAnswers.every(answer => answer !== undefined))
  }, [selectedAnswers])


  function handleSubmit() {
    const finalAnswersArray = selectedAnswers.map((userAnswer, index) => {
      const correctAnswer = apiData[index].correct_answer
      return {isUserCorrect: correctAnswer === userAnswer}
    })
    setFinalAnswersArray(finalAnswersArray)
    setIsSubmitted(prev => !prev)
  }  

  function handleAnswerClick(answer, questionIndex) {
    setSelectedAnswers(prevAnswers => {
      const updatedAnswers = [...prevAnswers]
      updatedAnswers[questionIndex] = answer
      return updatedAnswers
    })
  }

  // Helps us with the endMessage, the spelling of "answers" and toggling react-confetti
  const correctAnswersCount = finalAnswersArray.reduce((count, answerObj) => {
    return answerObj.isUserCorrect ? count + 1 : count
  }, 0)

  const endMessage = `You have ${correctAnswersCount}/${apiData.length} correct ${correctAnswersCount === 1 ? "answer" : "answers"}.`
  const onlyCorrectAnswers = correctAnswersCount === apiData.length

  const questionElements = apiData.map((question, questionIndex) => {
    return (
      <article key={uuidv4()}>
        <h3>{decode(question.question)}</h3>
        <ul>
            {question.answers.map(answer => {
                const isSelected = selectedAnswers[questionIndex] == answer 
  
                return (
                  <li key={uuidv4()}>
                    <button 
                      onClick={() => handleAnswerClick(answer, questionIndex)}
                      className={isSelected ? "isSelected" : ""}
                    >
                      {decode(answer)}
                    </button>
                  </li>
                )
            })}
        </ul>
      </article>
    )
  })

  const answerElements = apiData.map((question, questionIndex) => {
    return (
      <article key={uuidv4()}>
        <h3>{decode(question.question)}</h3>
        <ul>
            {question.answers.map(answer => {
              const isSelected = selectedAnswers[questionIndex] === answer
              const isCorrect = question.correct_answer === answer
              const isIncorrectGuess = isSelected && !isCorrect

              return (
                <li key={uuidv4()}>
                    <button
                      className={`${
                        isIncorrectGuess
                          ? 'isIncorrectGuess'
                          : isSelected && isCorrect
                          ? 'isCorrectGuess'
                          : !isSelected && isCorrect
                          ? 'isCorrectAnswer'
                          : 'isNotSelected'
                      }`}
                    >
                    {decode(answer)}
                  </button>
                </li>
                )
            })}
        </ul>
      </article>
    )
  })

  return (
    <>
      {isSubmitted ? (
        <section className="quiz-section">
          {onlyCorrectAnswers && <Confetti />}
          {answerElements}
          <div className="flex gap1">
            <p>{endMessage}</p>
            <button className="btn btn-primary align-self" onClick={props.handleChange}>NEW GAME</button>
          </div>
        </section>
      ) : (
        <section className="quiz-section">
          {questionElements}
          <button className="btn btn-primary " onClick={handleSubmit} disabled={!areAnswersComplete}>Check answers</button>
          {!areAnswersComplete && <span className="warning-message">Please answer all questions</span>}
        </section>
      )}
    </>
  )
}
