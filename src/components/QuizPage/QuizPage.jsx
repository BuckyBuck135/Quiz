import React from "react"
import { useState, useEffect } from 'react'
import "./QuizPage.css"
import { decode } from "he"
import Confetti from 'react-confetti'
import { v4 as uuidv4 } from 'uuid'

export default function QuizPage( {apiData, handleStart} ) {
  const [selectedAnswers, setSelectedAnswers] = useState([]) // Stores the selected answers
  const [finalAnswersArray, setFinalAnswersArray] = useState([]) // Helps us with the endMessage, the spelling of "answers" and toggling react-confetti
  const [isSubmitted, setIsSubmitted] = useState(false) // Helps with conditional rendering of questions / answers
  const [areAnswersComplete, setAreAnswersComplete] = useState(false) // Helps with validation

  // Initialize the selectedAnswers array with null values for each question; helps with validation.
  useEffect(() => {
    setSelectedAnswers(Array.from({length: apiData.length}))
  }, [apiData])

  console.log(selectedAnswers)
  // Checks if all questions have been answered
  useEffect(() => {
    setAreAnswersComplete(selectedAnswers.every(answer => answer !== undefined))
  }, [selectedAnswers])

  // When user clicks "Check Answers"
  function handleSubmit() {
    const finalAnswersArray = selectedAnswers.map((userAnswer, index) => {
      const correctAnswer = apiData[index].correct_answer
      return {isUserCorrect: correctAnswer === userAnswer}
    })
    setFinalAnswersArray(finalAnswersArray)
    setIsSubmitted(prev => !prev)
  }  

  // When user clicks on an answer
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

  // JSX for question elements
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

  // JSX for answer elements
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
            <button className="btn btn-primary align-self" onClick={handleStart}>NEW GAME</button>
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
