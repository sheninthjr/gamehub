"use client";
import Split from "react-split";
import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import axios from "axios";
import { useParams } from "next/navigation";
import { LANGUAGE_TYPE, Problems, ProblemType } from "@/data";

const SUBMISSION_BACKEND = "http://localhost:3003";

type SubmissionResult = {
  response: string;
  error?: string;
};

export default function CodeHub() {
  const { gameId } = useParams();
  const [selectedLanguage, setSelectedLanguage] =
    useState<LANGUAGE_TYPE>("python");
  const [code, setCode] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [submissionResult, setSubmissionResult] =
    useState<SubmissionResult | null>(null);
    const [currentProblem,setCurrentProblem] = useState<ProblemType>()
const [output,setOutput] = useState<string>("")
  useEffect(() => {
    const problems = Problems.find((p) => p.id === gameId);
    if(problems) {
      setCurrentProblem(problems);
      setCode(problems.code[selectedLanguage || ""] || "")
    }
  },[gameId,selectedLanguage])

  const copyToClipBoard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const submit = async () => {
    try {
      const response = await axios.post(`${SUBMISSION_BACKEND}/submission`, {
        data: {
          gameId,
          code,
          selectedLanguage,
        },
      });
      setSubmissionResult(response.data);
      setOutput(response.data.response)
    } catch (error) {
      console.error("Error submitting code:", error);
      setSubmissionResult({
        response: "",
        error: "Failed to submit code. Please try again.",
      });
    }
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLanguageSelect = (language: LANGUAGE_TYPE) => {
    setSelectedLanguage(language);
    if(currentProblem) {
      setCode(currentProblem.code[selectedLanguage] || "# Write some code here")
      setOutput("")
    }
    setDropdownOpen(false);
  };

  const languages: LANGUAGE_TYPE[] = ["cpp", "python", "java"];

  if(!currentProblem) {
    return(
      <div className="flex justify-center items-center h-screen text-white text-xl font-bold">
        OOPS problem not found!!
      </div>
    )
  }

  return (
    <Split
      sizes={[50, 50]}
      minSize={[300, 300]}
      className="flex split justify-start max-w-7xl mx-auto p-2 rounded-2xl mt-28 border border-neutral-700 h-[86vh]"
    >
      <div className="w-1/2 p-4 flex flex-col space-y-3 overflow-y-auto text-white">
        <ReactMarkdown
          className="markdown-content"
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold text-white mb-4">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-semibold text-white mt-4 mb-3">
                {children}
              </h2>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside text-gray-300">
                {children}
              </ul>
            ),
            li: ({ children }) => (
              <li className="text-gray-300 pl-4">{children}</li>
            ),
            pre: ({ children }) => (
              <pre className="bg-neutral-800 px-4 py-2 rounded-xl text-gray-200 overflow-x-auto">
                <code>{children}</code>
              </pre>
            ),
          }}
        >
          {currentProblem.problemStatement}
        </ReactMarkdown>
      </div>
      <div className="w-1/2 px-1 py-1 relative">
        <div className="flex justify-between z-[999]">
          <div className="relative w-36 z-[999]">
            <button
              onClick={toggleDropdown}
              className="bg-[#2F2F2F] text-white w-fit font-bold px-3 py-2 rounded-xl flex justify-between items-center"
            >
              {selectedLanguage.toUpperCase()}
              <span className=""></span>
            </button>
            {dropdownOpen && (
              <div className="absolute top-11 left-0 w-32 bg-[#2F2F2F] rounded-xl shadow-lg">
                {languages.map((language) => (
                  <div
                    key={language}
                    onClick={() => handleLanguageSelect(language)}
                    className="px-4 py-2 hover:bg-neutral-800 rounded-xl text-white cursor-pointer"
                  >
                    {language.toUpperCase()}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            className="text-green-500 font-bold px-2 py-1 rounded-xl bg-[#2F2F2F]"
            onClick={submit}
          >
            Run
          </button>
        </div>
        <div className="h-[93%] relative">
          <Editor
            height="100%"
            defaultValue="# Write your code here"
            value={code}
            language={selectedLanguage}
            theme="vs-dark"
            className="h-[93%] rounded-xl pt-2"
            onChange={(value) => setCode(value || "")}
            options={{
              minimap: {
                enabled: false,
              },
            }}
          />
        </div>
        <div className="absolute bottom-1 w-full px-0 z-[999]">
          {submissionResult && output &&  (
            <div className="mt-4 p-4 bg-neutral-800 rounded-xl text-white">
              <h2 className="text-lg font-semibold mb-2">Output:</h2>
              <pre className="bg-black/40 px-4 py-2 rounded-xl text-gray-200 overflow-x-auto">
                <code>
                  {submissionResult.error || output}
                </code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </Split>
  );
}
