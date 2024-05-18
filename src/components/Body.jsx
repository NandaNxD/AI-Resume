import React, { useState } from "react";
import { API_URL } from "../utils/constants";
import axios from "axios";
import Loader from "./Loader";

const Body = () => {
  const [fileDropped, setFileDropped] = useState(false);

  const [loading, setLoading] = useState(false);

  const [jobDescription, setJobdescription] = useState("");

  const [fileUploadProgress, setFileUploadProgress] = useState(0);

  const [skillsList, setSkillsList] = useState([]);

  const [resumeText, setResumeText] = useState("");

  const [dropZoneText, setDropZoneText] = useState("Upload your resume");

  const inputFileRef = React.useRef();

  const onFileChangeCapture = (event) => {
    const file = event.target.files[0];
    const isValid = isDroppedFileValid(file);

    if (isValid) {
      console.log("valid pdf");
      uploadPdf(file);
    } else {
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
    } else {
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
        setResumeText(response.data?.resume || "");
        setSkillsList(response.data?.keywords || []);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  };

  const showInvalidFileAlert = () => {
    alert("Only PDFs are allowed!");
  };

  return (
    <div className="w-full gap-2 px-4 flex flex-col mt-5">
      {!resumeText && (
        <div className="flex justify-around">
          <div className="w-3/5">
            <span className="text-5xl block">Want to fix your Resume?</span>
            <span className="text-xl text-gray-500 block">
              Use GEN-AI Powered Resume Scan
            </span>

            <span className="block text-md my-4">
              Our powerful resume scanner helps you create an ATS-friendly
              resume that stands out from the crowd and increases your chances
              of landing an interview.
            </span>

            <span className="block text-md my-4 text-xl">
                Our scanner has 6 advanced checks:
            </span>

            <ul className="list-decimal font-bold px-4">
              <li className="list-item">Parsability Rate</li>
              <li className="list-item">ATS Compatibility</li>
              <li className="list-item"> Skills and Keywords</li>
              <li className="list-item">Readable Contact Information</li>
              <li className="list-item"> File Type and Length</li>
              <li className="list-item"> Suggestions for Improvement</li>
            </ul>
          </div>

          <div className="w-3/12">
            <img
              className="w-auto"
              alt="img"
              src="https://www.myperfectresume.com/wp-content/uploads/2024/02/a-resume-format-hero.png"
            ></img>
          </div>
        </div>
      )}

      <input
        type="file"
        style={{ display: "none" }}
        ref={inputFileRef}
        onChange={onFileChangeCapture}
      ></input>

      <div className="relative flex justify-center items-center">
        {loading && (
          <div className="absolute z-10 text-white">
            <Loader />
          </div>
        )}
        <div
          className={`h-60 w-80 rounded-2xl shadow-2xl flex justify-center border-2 self-center
            ${
              dropZoneText !== "Upload your resume"
                ? "border-black"
                : "border-dashed border-white"
            }  
            items-center text-xl flex-col text-black bg-blue-600 drop-shadow-lg active:scale-95 cursor-pointer transition-all
            ${loading ? "blur-sm pointer-events-none relative" : ""}

            hover:scale-105
            
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
              src="https://www.svgrepo.com/show/73906/cloud-upload.svg"
              className="w-40 bg-transparent"
            ></img>
          </div>
          <span className="font-bold">{dropZoneText}</span>

          <span className="text-sm text-black">Supports .PDF</span>
        </div>
      </div>

      {/* <div className="">
        <textarea value={jobDescription}></textarea>
      </div> */}

      {resumeText && !loading && (
        <div className="w-full flex px-2 gap-4 h-72 justify-center">
          <div className="w-[70%] shadow-lg">
            <span className="font-bold text-xl">Resume Text</span>
            <div
              contentEditable
              className="w-full px-2 border-black border-2 h-[90%] rounded-lg whitespace-pre-wrap overflow-auto"
            >
              {resumeText}
            </div>
          </div>

          <div className="shadow-lg rounded-lg">
            <span className="font-bold text-xl text-center">Skills</span>
            <ol className=" h-[90%] overflow-auto p-2 border-black rounded-lg border-2">
              {skillsList.map((skill, index) => {
                return (
                  <li
                    className="hover:bg-gray-200 p-2 rounded-lg cursor-pointer"
                    key={index}
                  >
                    {index + 1 + ".   "}
                    {skill}
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default Body;
