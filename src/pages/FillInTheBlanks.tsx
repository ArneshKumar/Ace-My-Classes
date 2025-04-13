import React, { useState, useEffect } from "react";
import "./FlashCards.css";
//import Homepage, transcript "./Homepage.tsx";
import { useNavigate, useLocation } from "react-router-dom";
import "../globals.d.ts";
export interface IFlashCardsProps {}

const FlashCards: React.FunctionComponent<IFlashCardsProps> = (props) => {
  type Flashcard = {
    question: string;
    answer: string;
  };

  const navigate = useNavigate();
  const location = useLocation();
  const transcript = location.state?.transcript;
  const [hasRun, setHasRun] = useState(false);
  const goBackNotes = () => {
    navigate("/Notes", { state: { transcript } });
  };
  // const [flashcards, setFlashcards] = useState<string | null>(null);

  const run = async () => {
    const cohereApiKey = "CfPSXJUVOEAiShO3FKln3WRLb8fBr8jca9YVr8h2"; // replace this

    try {
      const response = await fetch("https://api.cohere.ai/v1/generate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cohereApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "command",
          prompt: `Generate 5 fill in the blank questions in the format with "Question: ... on one line then Answer: ... in the next line" based on this transcript
          The statements below is the example of how the format should be; DO NOT USE THE SAME QUESTIONS, Only the question and answers should be there, no exta lines or bullet points or numbered points, no extra confirmation lines at the top either.
          DO NOT SAY THIS LINE AT ALL IN THE RESPONSE AND DO NOT PUT ANY EMPTY LINES AT ALLLL: "Here are five fill in the blank questions and their answers:"
          Question: ___ is the capital of France?
          Answer: Paris
          Question: 2 + 2 is __. 
          Answer: 4
          :\n\n${transcript}`,
          temperature: 0.6,
        }),
      });

      const data = await response.json();
      const textQuestionsAnswers = data.generations[0].text;

      console.log(textQuestionsAnswers); // This is a string of flashcards

      return textQuestionsAnswers;
    } catch (error) {
      console.error("Error using Cohere:", error);
    }
  };

  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  function parseFlashcards(rawText: string): Flashcard[] {
    const flashcards: Flashcard[] = [];

    // Split by individual lines
    const lines = rawText.split(/\r?\n/);
    for (let i = 0; i < lines.length; i++) {
      const questionMatch = lines[i].match(/^Question:\s*(.+)/i);
      const answerMatch = lines[i + 1]?.match(/^Answer:\s*(.+)/i);

      if (questionMatch && answerMatch) {
        flashcards.push({
          question: questionMatch[1].trim(),
          answer: answerMatch[1].trim(),
        });
        i++; // Skip the next line since we just processed it as the answer
      }
    }

    return flashcards;
  }

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        const response = await run(); // this returns a string
        const parsedFlashcards = parseFlashcards(response || ""); // fallback to empty string if undefined
        setFlashcards(parsedFlashcards); // now you're giving it Flashcard[]
      } catch (err) {
        console.error("Error generating flashcards:", err);
      }
    };

    fetchFlashcards();
  }, []);

  const checkFlashcards: Flashcard[] = [
    { question: "Capital of France?", answer: "Paris" },
    { question: "2 + 2", answer: "4" },
    { question: "React is a ...?", answer: "JavaScript library" },
  ];
  console.log(checkFlashcards);
  console.log(flashcards);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  if (flashcards.length === 0) {
    return <div>Loading fill in the blanks...</div>; // or a spinner, skeleton, etc.
  }

  const currentCard = flashcards[currentIndex];

  const handleFlip = () => {
    setShowAnswer((prev) => !prev);
  };

  const handleNext = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev + 1) % flashcards.length);
  };

  const handlePrev = () => {
    setShowAnswer(false);
    setCurrentIndex((prev) => (prev === 0 ? flashcards.length - 1 : prev - 1));
  };

  return (
    <>
      <button className="navigate-study" onClick={goBackNotes}>
        Go Back to Notes
      </button>

      <div className="buttons">
        <button className="Navigate" onClick={handlePrev}>
          Previous
        </button>
        <button id="flashcards" onClick={handleFlip}>
          {showAnswer ? currentCard.answer : currentCard.question}
        </button>
        <button className="Navigate" onClick={handleNext}>
          Next
        </button>
      </div>
    </>
  );
};
export default FlashCards;
