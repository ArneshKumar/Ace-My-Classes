import React, { useState, useEffect } from "react";
import "./FlashCards.css";
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

  const run = async () => {
    const cohereApiKey = "CfPSXJUVOEAiShO3FKln3WRLb8fBr8jca9YVr8h2";

    try {
      const response = await fetch("https://api.cohere.ai/v1/generate", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${cohereApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "command",
          prompt: `Generate 5 flashcards in the format "Question: ... | Answer: ..." based on this transcript.m. Keep the Question and Answer seperated with | so it should look like this Question | Answer:"\n\n${transcript}`,
          temperature: 0,
        }),
      });

      const data = await response.json();
      const textQuestionsAnswers = data.generations[0].text;

      console.log(textQuestionsAnswers); // This is a string of flashcards
      //   console.log(setOfFlashcards);
      //   console.log(flashcards);
      return textQuestionsAnswers;
    } catch (error) {
      console.error("Error using Cohere:", error);
    }
  };

  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);

  //   function parseFlashcards(rawText: string): Flashcard[] {
  //     const flashcards: Flashcard[] = [];

  //     const lines = rawText.split("\n");
  //     for (const line of lines) {
  //       const qaMatch = line.match(/Question:\s*(.+?)\s*\|\s*Answer:\s*(.+)/i);
  //       if (qaMatch) {
  //         flashcards.push({
  //           question: qaMatch[1].trim(),
  //           answer: qaMatch[2].trim(),
  //         });
  //       }
  //     }

  //     return flashcards;
  //   }

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

  //   return (
  //     <div>
  //       <h2>Generated Flashcards</h2>
  //       <pre>{flashcards}</pre>
  //     </div>
  //   );

  //   const apiKey =
  //     "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";

  //   const run = async () => {
  //     try {
  //       const response = await fetch(
  //         "https://api.openai.com/v1/chat/completions",
  //         {
  //           method: "POST",
  //           headers: {
  //             Authorization: `Bearer ${apiKey}`,
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({
  //             model: "gpt-3.5-turbo",
  //             messages: [
  //               {
  //                 role: "system",
  //                 content: `You are a helpful Flash Card generator.`,
  //               },
  //               {
  //                 role: "user",
  //                 content: `Make Flash card text for this lecture, can you give it as two different string lists. Make a minimum of 5 based on this and a maximum of 15. ${transcript}`,
  //               },
  //             ],
  //           }),
  //         }
  //       );

  //       //     const data = await response.json();
  //       //     console.log(data.choices[0].message.content);
  //       //   } catch (error) {
  //       //     // console.error("Error during transcription:", error);
  //       //     return error;
  //       //   }
  //       // };
  //       // run();
  //       // type Flashcard = {
  //       //   question: string;
  //       //   answer: string;
  //       // };
  //       console.log("Transcript being sent to OpenAI:", transcript);

  //       if (!response.ok) {
  //         const errorText = await response.text(); // to see if OpenAI returns a reason
  //         console.error("OpenAI error response:", errorText);
  //         throw new Error(`OpenAI API error: ${response.statusText}`);
  //       }

  //       const data = await response.json();
  //       const content = data.choices?.[0]?.message?.content;
  //       setFlashcards(content || "No content received.");
  //     } catch (error: any) {
  //       console.error("Error generating flashcards:", error);
  //       if (error instanceof Error) {
  //         setFlashcards(`Error: ${error.message}`);
  //       } else {
  // setFlashcards("An unknown error occurred.");
  //       }
  //     }
  //   };

  //   useEffect(() => {
  //     if (transcript.trim().length > 0) {
  //       run();
  //     }
  //   }, [transcript]);

  //   return (
  //     <div>
  //       <h2>Generated Flashcards</h2>
  //       <pre>{flashcards}</pre>
  //     </div>
  //   );
  // };

  //   type Flashcard = {
  //     question: string;
  //     answer: string;
  //   };

  //   function parseFlashcards(rawText: string): Flashcard[] {
  //     const flashcards: Flashcard[] = [];

  //     const blocks = rawText.split(/(?:\r?\n){2,}/); // split on blank lines
  //     for (const block of blocks) {
  //       const questionMatch = block.match(/Question:\s*(.+)/i);
  //       const answerMatch = block.match(/Answer:\s*(.+)/i);

  //       if (questionMatch && answerMatch) {
  //         flashcards.push({
  //           question: questionMatch[1].trim(),
  //           answer: answerMatch[1].trim(),
  //         });
  //       }
  //     }

  //     return flashcards;
  //   }

  // const flashcards = parseFlashcards(run());

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
    return <div>Loading flashcards...</div>; // or a spinner, skeleton, etc.
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
