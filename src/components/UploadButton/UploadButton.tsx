import React, { useState, ChangeEvent, FormEvent, useRef, useEffect } from 'react';
import axios from "axios";
import pdfToText from 'react-pdftotext'

const UploadButton: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState({started: false, pc: 0});
    const [msg, setMsg] = useState("");
    const ref = useRef<HTMLInputElement>(null);
    const [resume, setResume] = useState({ resume: "" });
    

    const reset = () => {
        if(ref.current){
            ref.current.value="";
        }
        setFile(null);
        setResume({resume:""});
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type === "application/pdf") {
                setFile(selectedFile);
                setMsg(""); // Clear any previous error message
            } else {
                setFile(null);
                setMsg("Please select a PDF file.");
                reset();
            }
        }
    };

    const submitFile = async () => {
        if (file) {
          try {
            const text = await pdfToText(file);
            setResume({ resume: text });
            setProgress(prevState => ({ ...prevState, started: true }));
            setMsg("Uploading...");
          } catch (error) {
            console.error("Failed to extract text from pdf");
          }
        } else {
          console.error("No file selected");
        }
      };
      
      useEffect(() => {
        if (resume && resume.resume) {
          axios.post('http://localhost:3000/insert', resume, {
            onUploadProgress: (progressEvent) => {
              setProgress(prevState => ({
                ...prevState,
                pc: progressEvent.loaded*100
              }));
            },
            headers: {
              "Custom-Header": "value",
            }
          })
          .then(res => {
            setMsg("Upload successful");
            console.log(resume);
            console.log(res.data);
            reset();
          })
          .catch(err => console.log(err));
        }
      }, [resume]); // Trigger this effect whenever 'resume' changes
      


    return (
        <div>
            <input 
                type="file"
                ref={ref}
                accept="application/pdf"
                required
                onChange={handleFileChange}/>
            <button onClick={submitFile}>Upload PDF</button>

            {msg && <span>{msg}</span>}
        </div>
    );
};

export default UploadButton;
