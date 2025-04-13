import React, { useState, useRef, useCallback } from "react";
import "./Homepage.css";
// import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { AssemblyAI } from "assemblyai";
import Notes from "./Notes.tsx";
import "../globals.d.ts";
//import { initializeApp } from "firebase/app";
// import { getFirestore } from "firebase/firestore";

// import { FaSearch } from "react-icons/fa";
// import Button from "react-bootstrap/Button";

const client = new AssemblyAI({
  apiKey: "d5562ce160d84555bd0d4e20ab9c19f2",
});
export interface IHomePageProps {}

const Homepage: React.FunctionComponent<IHomePageProps> = (props) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // const [transcript, setTranscript] = useState<string | null>(null);
  // const [isTranscribing, setIsTranscribing] = useState<boolean>(false);

  const navigate = useNavigate();
  const fileInput = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInput.current?.click();
  };

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const selectFiles = event.target.files;
  //   if (selectFiles && selectFiles.length > 0) {
  //     const file = event.target.files?.[0];
  //     // Handle the selected file(s) here
  //     console.log("Selected file(s):", file);
  //     setSelectedFile(file || null);
  //     // navigate("/Notes");
  //     // const audioUrl = '';
  //     const config = {
  //       audio_url: file?.name,
  //     };

  //     const run = async () => {
  //       const transcript = await client.transcripts.create(config);
  //       console.log(transcript.text);
  //     };
  //     run();
  //   }
  // };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      const file = selectedFiles?.[0];
      setSelectedFile(file || null);

      // const uploadResponse = await client.files.upload(file);
      // const transcriptResponse = await client.transcripts.create({
      //   audio_url: uploadResponse,
      // });
      // setTranscript(transcriptResponse.text ?? null);
      // console.log(transcript);

      const run = async () => {
        try {
          const uploadResponse = await fetch(
            "https://api.assemblyai.com/v2/upload",
            {
              method: "POST",
              headers: {
                authorization: "d5562ce160d84555bd0d4e20ab9c19f2",
              },
              body: file,
            }
          );

          const uploadData = await uploadResponse.json();
          const audio_url = uploadData.upload_url;

          const transcriptResponse = await fetch(
            "https://api.assemblyai.com/v2/transcript",
            {
              method: "POST",
              headers: {
                authorization: "d5562ce160d84555bd0d4e20ab9c19f2",
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                audio_url,
              }),
            }
          );

          const transcriptData = await transcriptResponse.json();
          const transcriptId = transcriptData.id;

          let completed = false;
          let transcriptResult;

          while (!completed) {
            const pollingResponse = await fetch(
              `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
              {
                headers: {
                  authorization: "d5562ce160d84555bd0d4e20ab9c19f2",
                },
              }
            );

            transcriptResult = await pollingResponse.json();
            if (transcriptResult.status === "completed") {
              completed = true;
            } else if (transcriptResult.status === "error") {
              throw new Error(
                "Transcription failed: " + transcriptResult.error
              );
            } else {
              await new Promise((res) => setTimeout(res, 3000));
            }
          }

          // console.log("Transcript text:", transcriptResult.text);
          // setTranscript(transcriptResult.text);
          // myGlobalVariable = transcriptResult.text;
          return transcriptResult.text;
        } catch (error) {
          // console.error("Error during transcription:", error);
          return error;
        }
      };

      const transcript = await run();
      navigate("/Notes", { state: { transcript } });
    }
  };
  // const transcript = handleFileChange(fileInput);
  // const handleTranscribe = useCallback(async () => {
  //   if (!selectedFile) {
  //     alert("Please select a file first.");
  //     return;
  //   }
  //   setIsTranscribing(true);
  //   const formData = new FormData();
  //   formData.append("file", selectedFile);
  //   try {
  //     const response = await fetch("/api/transcribe", {
  //       method: "POST",
  //       body: formData,
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }
  //     const data = await response.json();
  //     setTranscript(data.transcript);
  //   } catch (error) {
  //     console.error("Error transcribing the file:", error);
  //     setTranscript("Transcription failed.");
  //   } finally {
  //     setIsTranscribing(false);
  //   }
  // }, [selectedFile]);
  //   const auth = getAuth();
  //   const [authing, setAuthing] = useState(false);

  //   const signInWithGoogle = async () => {
  // setAuthing(true);

  // signInWithPopup(auth, new GoogleAuthProvider())
  //   .then((response) => {
  //     console.log(response.user.uid);
  //     navigate("/");
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     setAuthing(false);
  //   });
  //   };
  //   const [action, setAction] = useState("Login");
  return (
    <div className="container">
      <button className="submit" onClick={handleButtonClick}>
        Upload File
      </button>
      <input
        type="file"
        style={{ display: "none" }}
        ref={fileInput}
        onChange={handleFileChange}
        accept=".mov, .mp3, .mp4"
      />
      {/* <Notes transcript={transcript} setTranscript={handleFileChange} /> */}
      <p>
        Accepted file types: <code>.mp3</code>, <code>.mp4</code>,{" "}
        <code>.mov</code>
      </p>
      <h1 className="logo">Ace My Classes</h1>
      {/* <p>{{ transcript }}</p> */}
    </div>
  );
};

//};

// const LoginSignup = () => {
//   const [action, setAction] = useState("Login");
//   return (
//     <div className="container">
//       <div className="header">
//         <div className="text">{action}</div>
//         <div className="underline"></div>
//       </div>
//       <div className="inputs">
//         {action === "Login" ? (
//           <div></div>
//         ) : (
//           <div className="input">
//             <input placeholder="Enter name" type="text" />
//           </div>
//         )}
//         <div className="input">
//           <input placeholder="Enter email" type="email" />
//         </div>
//         <div className="input">
//           <input placeholder="Enter password" type="password" />
//         </div>
//       </div>
//       {action === "Sign Up" ? (
//         <div></div>
//       ) : (
//         <div className="forgot-password">
//           {" "}
//           Lost Password? <span>Click Here!</span>
//         </div>
//       )}
//       <div className="submit-container">
//         <div
//           className={action === "Login" ? "submit gray" : "submit"}
//           onClick={() => {
//             setAction("Sign Up");
//           }}
//         >
//           Sign Up
//         </div>
//         <div
//           className={action === "Sign Up" ? "submit gray" : "submit"}
//           onClick={() => {
//             setAction("Login");
//           }}
//         >
//           Login
//         </div>
//       </div>
//     </div>
//   );
// };

export default Homepage;
// // ParentComponent.tsx
// import React, { useState } from "react";
// import ChildComponent from "./ChildComponent";

// const ParentComponent: React.FC = () => {
//   const [count, setCount] = useState(0);

//   return (
//     <div>
//       <p>Count: {count}</p>
//       <button onClick={() => setCount(count + 1)}>Increment</button>
//       <ChildComponent count={count} setCount={setCount} />
//     </div>
//   );
// };

// export default ParentComponent;

// // ChildComponent.tsx
// import React from "react";

// interface ChildProps {
//   count: number;
//   setCount: (count: number) => void;
// }

// const ChildComponent: React.FC<ChildProps> = ({ count, setCount }) => {
//   return (
//     <div>
//       <p>Child Count: {count}</p>
//       <button onClick={() => setCount(count - 1)}>Decrement</button>
//     </div>
//   );
// };

// export default ChildComponent;
