"use client";
import Split from "react-split";
import { Editor } from "@monaco-editor/react";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import axios from "axios";
import jwt from "json-web-token";
import { useParams } from "next/navigation";
import { LANGUAGE_TYPE, Problems, ProblemType } from "@/data";
import { PROBLEM_SECRET } from "@/config";
import { CheckCheck, X } from "lucide-react";

const SUBMISSION_BACKEND = "http://localhost:3003";

type SubmissionResult = {
  testResults: {
    testCaseNumber: number;
    input: any[];
    expectedOutput: any[];
    actualOutput: any[];
    passed: boolean;
  }[];
  totalTestCases: number;
  passedTestCases: number;
  status: string;
};

export default function CodeHub() {
  const { problemId } = useParams();
  const [selectedLanguage, setSelectedLanguage] =
    useState<LANGUAGE_TYPE>("python");
  const [code, setCode] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [submissionResult, setSubmissionResult] =
    useState<SubmissionResult | null>(null);
  const [currentProblem, setCurrentProblem] = useState<ProblemType>();
  const [output, setOutput] = useState<any[]>([]);

  useEffect(() => {
    const problems = Problems.find((p) => p.problemId === problemId);
    if (problems) {
      setCurrentProblem(problems);
      setCode(problems.code[selectedLanguage || ""] || "");
    }
  }, [problemId, selectedLanguage]);

  const submit = async () => {
    try {
      const response = await axios.post(`${SUBMISSION_BACKEND}/submission`, {
        data: {
          problemId,
          code,
          selectedLanguage,
        },
      });
      jwt.decode(
        PROBLEM_SECRET as string,
        response.data.response,
        (err, token: any) => {
          if (err) {
            console.error(err);
          } else {
            setSubmissionResult(token);
            console.log(token);
            setOutput(token.testResults || []);
          }
        },
      );
    } catch (error) {
      console.error("Error submitting code:", error);
      setSubmissionResult({
        testResults: [],
        totalTestCases: 0,
        passedTestCases: 0,
        status: "Failed",
      });
    }
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLanguageSelect = (language: LANGUAGE_TYPE) => {
    setSelectedLanguage(language);
    if (currentProblem) {
      setCode(
        currentProblem.code[selectedLanguage] || "# Write some code here",
      );
      setOutput([]);
    }
    setDropdownOpen(false);
  };

  const languages: LANGUAGE_TYPE[] = ["cpp", "python", "java"];

  if (!currentProblem) {
    return (
      <div className="flex justify-center items-center h-screen text-white text-xl font-bold">
        OOPS problem not found!!
      </div>
    );
  }

  return (
    <Split
      sizes={[50, 50]}
      minSize={[300, 300]}
      className="flex split justify-start max-w-7xl mx-auto p-2 rounded-2xl mt-28 border border-neutral-700 h-[86vh]"
    >
      <div className="w-1/2 p-4 flex flex-col space-y-3 overflow-y-auto text-black">
        <ReactMarkdown
          className="markdown-content"
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            h1: ({ children }) => (
              <h1 className="text-2xl font-bold text-black mb-4">{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-xl font-semibold text-black mt-4 mb-3">
                {children}
              </h2>
            ),
            ul: ({ children }) => (
              <ul className="list-disc list-inside text-gray-500">
                {children}
              </ul>
            ),
            li: ({ children }) => (
              <li className="text-gray-500 pl-4">{children}</li>
            ),
            pre: ({ children }) => (
              <pre className="bg-neutral-800 px-4 py-2 rounded-xl text-gray-100 overflow-x-auto">
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
              className="bg-[#cccaca] text-black w-fit font-bold px-3 py-1 rounded-xl flex justify-between items-center"
            >
              {selectedLanguage.toUpperCase()}
            </button>
            {dropdownOpen && (
              <div className="absolute top-11 left-0 w-32 bg-[#cfcfcf] rounded-xl shadow-lg">
                {languages.map((language) => (
                  <div
                    key={language}
                    onClick={() => handleLanguageSelect(language)}
                    className="px-4 py-2 hover:bg-neutral-400 rounded-xl text-black cursor-pointer"
                  >
                    {language.toUpperCase()}
                  </div>
                ))}
              </div>
            )}
          </div>
          <button
            className="text-green-500 font-bold px-2 py-1 rounded-xl border border-neutral-300 bg-[#f1f1f1]"
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
            theme="light"
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
          {submissionResult && output && (
            <div className="mt-4 p-4 bg-neutral-800 rounded-xl text-black">
              <h2 className="text-lg font-semibold mb-2">Test Case Results:</h2>
              <div className="flex justify-evenly gap-4">
                {output.map((test, index) => (
                  <div
                    key={index}
                    className={`flex w-fit justify-evenly text-md px-4 font-bold py-2 rounded-xl ${
                      test.passed ? "bg-green-700" : "bg-red-700"
                    }`}
                  >
                    <span>{test.passed ? <CheckCheck /> : <X />}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Split>
  );
}
