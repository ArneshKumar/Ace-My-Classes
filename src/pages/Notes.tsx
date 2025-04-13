import React, { useRef, useCallback } from "react";
import "./Notes.css";
//import Homepage, transcript "./Homepage.tsx";
import { useNavigate, useLocation } from "react-router-dom";
import "../globals.d.ts";
export interface INotesProps {}

// const Notes: React.FunctionComponent<INotesProps> = (props) => {
//   const navigate = useNavigate();
//   const fileInput = useRef<HTMLInputElement>(null);

//   const handleButtonClick = () => {
//     fileInput.current?.click();
//   };

//   const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const selectFiles = event.target.files;
//     if (selectFiles && selectFiles.length > 0) {
//       // Handle the selected file(s) here
//       console.log("Selected file(s):", selectFiles);

//       return (
//         <div className="container">
//           <button onClick={handleButtonClick}>Upload File</button>
//           <input
//             type="file"
//             style={{ display: "none" }}
//             ref={fileInput}
//             onChange={handleFileChange}
//           />
//           <h1 className="logo">Ace My Classes</h1>
//           {}
//         </div>
//       );
//     };

const Notes: React.FunctionComponent<INotesProps> = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const transcript = location.state?.transcript;
  const goBackHomepage = () => {
    navigate("/");
  };
  const flashCards = () => {
    navigate("/Flashcards", { state: { transcript } });
  };
  const fillInTheBlanks = () => {
    navigate("/FillInTheBlanks", { state: { transcript } });
  };
  const multipleChoice = () => {
    navigate("/MultipleChoiceQuestions", { state: { transcript } });
  };
  return (
    <>
      <button className="navigate-homepage" onClick={goBackHomepage}>
        Go Back to Homepage
      </button>
      {/* <h1 style={{ color: "white" }}>Notes</h1> */}
      <p className="notes">{transcript}</p>
      {/* <p className="notes">{{ myGlobalVariable }}</p> */}

      {/* {selectedFile && (

                    {selectedFile.name} + "-" + {selectedFile.type()}

            )} */}
      {/* {isTranscribing ? "Transcribing..." : "Transcribe"}
      {transcript} */}
      <div className="buttons">
        <button className="Navigate" onClick={flashCards}>
          Flashcards
        </button>
        <button className="Navigate" onClick={fillInTheBlanks}>
          Fill in the Blanks
        </button>
      </div>
    </>
  );
};

export default Notes;
