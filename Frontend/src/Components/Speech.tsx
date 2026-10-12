import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import Video from './Video';
import axios from 'axios';
import { useDispatch } from 'react-redux';

const Speech = () => {
  const [text, setText] = useState('');
  const [question, setQuestion] = useState([]);
  const [currentQuestion, setCurrent] = useState(0);
  const [interviewStarted, setInterviewStarted] = useState(false);

  const dispatch = useDispatch();

  // useEffect(() => {
  //   axios.get("http://localhost:8080/bot/node")
  //     .then((res) => {
  //       console.log(res.data);

       
  //       const paragraphs = res.data.split('\n');

       
  //       const questionsArray = paragraphs.filter((paragraph:any) => /^\d+\.\s/.test(paragraph));
  //       setQuestion(questionsArray);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     })
  // }, [])

  const startListening = () => SpeechRecognition.startListening({ continuous: true, language: 'en-IN' });

  const resetTranscript = () => {
    SpeechRecognition.stopListening();
    setText(''); // Clear the textarea
    SpeechRecognition.startListening(); // Restart listening
  };

  const { listening, transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  const handleStartInterview = () => {
    setInterviewStarted(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < question.length - 1) {
      setCurrent(currentQuestion + 1);
    }
  };

  return (
    <div className="flex">
      <div className="w-1/2">
        <Video />
      </div>
      <div className="w-1/2 p-4">
        <div className="container mx-auto p-4 shadow-lg bg-neutral-100">
          {!interviewStarted && (
            <button onClick={handleStartInterview} className='bg-gray-500 text-white px-4 py-2 font-medium rounded-full hover:bg-gray-600'>
              Start interview
            </button>
          )}

          {interviewStarted && (
            <>
              <h3 className="text-2xl font-bold mb-4">{question[currentQuestion]}</h3>
              <button onClick={handleNextQuestion} className='bg-gray-500 text-white px-4 py-2 font-medium rounded-full hover:bg-gray-600'>
                  Next
                </button>
            
            
              {/* <div className="main-content border rounded p-4 mb-4">
                {transcript}
              </div> */}
              <div className="btn-style">
                <textarea
                  name=""
                  id=""
                  value={transcript}
                  onChange={(e) => setText(transcript)}
                  className="w-full border rounded p-2 mb-4"
                  placeholder="Transcript..."
                />
                <button onClick={startListening} className='bg-blue-500 text-white px-4 py-2 font-medium rounded-full mr-2 hover:bg-blue-600'>
                  {listening ? "Listening..." : "Start listening"}
                </button>
                <button onClick={SpeechRecognition.stopListening} className='bg-red-500 text-white px-4 py-2 font-medium rounded-full mr-2 hover:bg-red-600'>
                  Stop Listening
                </button>
                <button className='bg-red-500 text-white px-4 py-2 font-medium rounded-full mr-2 hover:bg-red-600'>
                  Submit
                </button>
                <button onClick={resetTranscript} className='bg-gray-500 text-white px-4 py-2 font-medium rounded-full hover:bg-gray-600'>
                  Reset
                </button>
              
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Speech;
