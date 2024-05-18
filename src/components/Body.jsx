import React, { useState } from "react";
import { API_URL } from "../utils/constants";
import axios from "axios";

const Body = () => {
  const [fileDropped, setFileDropped] = useState(false);

  const [loading, setLoading] = useState(false);

  const [fileUploadProgress, setFileUploadProgress] = useState(0);

  const [resumeText, setResumeText] = useState("");

  const [dropZoneText, setDropZoneText] = useState("Upload +");


  const inputFileRef = React.useRef();

  const onFileChangeCapture = (event)=>{
    const file=event.target.files[0];
    const isValid=isDroppedFileValid(file);

    if(isValid){
        console.log("valid pdf");
        uploadPdf(file);
    }
    else{
        showInvalidFileAlert();
    }
  };

  const handleUploadClick = (event) => {
    /*Collecting node-element and performing click*/
    inputFileRef.current.click();
  };


  /**
   *
   * @param {DragEvent} event
   */
  const handleDragOver = (event) => {
    event.preventDefault();
    setDropZoneText("Drop");
  };

  /**
   *
   * @param {DragEvent} event
   */
  const handleDragLeave = (event) => {
    event.preventDefault();
    setDropZoneText("Upload +");
  };

  /**
   *
   * @param {DragEvent} event
   */
  const handleDrop = (event) => {
    event.preventDefault();

    setDropZoneText("Upload +");
    console.log("dropped");

    const file = event.dataTransfer.files[0];

    const isValidFile = isDroppedFileValid(file);

    if (isValidFile) {
      console.log("valid pdf");
      uploadPdf(file);
    }
    else{
        showInvalidFileAlert();
    }
  };

  /**
   *
   * @param {File} file
   * @returns {boolean}
   */
  const isDroppedFileValid = (file) => {
    const validFileTypes = ["application/pdf"];

    return validFileTypes.includes(file.type);
  };

  /**
   *
   * @param {File} file
   */
  const uploadPdf = (file) => {
    const apiEndPoint = `${API_URL}/upload`;

    const formData = new FormData();
    formData.append("pdf", file);

    setLoading(true);
    axios
      .post(apiEndPoint, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setLoading(false);
        setResumeText(response.data);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const showInvalidFileAlert=()=>{
    alert('Only PDFs are allowed!');
  }

  return (
    <div className="h-[90vh] flex items-center justify-center flex-col w-full gap-4">
      <input type="file" style={{ display: "none" }} ref={inputFileRef} onChange={onFileChangeCapture}></input>
      <div
        className={`h-60 w-80 rounded-2xl shadow-2xl flex justify-center border-2
            ${dropZoneText !== "Upload +" ? "border-black" : "border-dashed border-white"}  
            items-center text-xl flex-col text-white bg-blue-600 drop-shadow-lg active:scale-95 cursor-pointer transition-all
            ${loading?'blur-sm pointer-events-none relative':''}
                
        `}
        draggable={true}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onDragLeave={handleDragLeave}
        onClick={handleUploadClick}
      >
        <div>
          <img
            alt="upload image illustration"
            src="https://cdn-icons-png.flaticon.com/512/5868/5868106.png"
            className="w-40"
          ></img>
        </div>

        {dropZoneText}
      </div>

      {loading && (
        <svg
            className="absolute"
          xmlns="http://www.w3.org/2000/svg"
          width="4rem"
          height="4rem"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"
            opacity="0.25"
          />
          <path
            fill="currentColor"
            d="M12,4a8,8,0,0,1,7.89,6.7A1.53,1.53,0,0,0,21.38,12h0a1.5,1.5,0,0,0,1.48-1.75,11,11,0,0,0-21.72,0A1.5,1.5,0,0,0,2.62,12h0a1.53,1.53,0,0,0,1.49-1.3A8,8,0,0,1,12,4Z"
          >
            <animateTransform
              attributeName="transform"
              dur="0.75s"
              repeatCount="indefinite"
              type="rotate"
              values="0 12 12;360 12 12"
            />
          </path>
        </svg>
      )}

      {resumeText && !loading && (
        <div className="px-10 w-full">
          <textarea value={resumeText} className="w-full px-2 h-60 border-black border-2 rounded-lg"></textarea>
        </div>
      )}
    </div>
  );
};

export default Body;
