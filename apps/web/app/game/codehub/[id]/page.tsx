"use client";
import Split from "react-split";
import { Editor } from "@monaco-editor/react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import axios from "axios";
import { useParams } from "next/navigation";

const SUBMISSION_BACKEND = "http://localhost:3003";

type LANGUAGE_TYPE = "cpp" | "python" | "javascript" | "java";

type SubmissionResult = {
  response: string;
  error?: string;
};

export default function CodeHub() {
  const { id } = useParams();
  const [selectedLanguage, setSelectedLanguage] =
    useState<LANGUAGE_TYPE>("python");
  const [code, setCode] = useState<string>("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [submissionResult, setSubmissionResult] =
    useState<SubmissionResult | null>(null);

  const problemStatement = `# Insertion Sort Problem

## Problem Description
Given an array, implement the insertion sort algorithm to sort the array in ascending order.

## Input Format
- The first line contains 'T' denoting the number of test cases. 
- Next T lines each contain a number 'n' denoting the number of elements, followed by n space-separated numbers denoting the array elements.

## Sample Input
\`\`\`
5
4 2 5 3 1
3
11 4 200
\`\`\`

## Output Format
- T lines contain n numbers denoting the sorted array.

## Sample Output
\`\`\`
1 2 3 4 5
4 11 200
\`\`\`

## Constraints
- 1 ≤ T ≤ 100
- 1 ≤ N ≤ 100
- 1 ≤ array elements ≤ 10^6

## Explanation
Insertion sort works by building the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.`;

  const copyToClipBoard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const submit = async () => {
    try {
      const response = await axios.post(`${SUBMISSION_BACKEND}/submission`, {
        data: {
          id,
          code,
          selectedLanguage,
        },
      });
      setSubmissionResult(response.data);
      console.log(response.data);
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
    setDropdownOpen(false);
  };

  const languages: LANGUAGE_TYPE[] = ["cpp", "python", "javascript", "java"];

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
          {problemStatement}
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
          {submissionResult && (
            <div className="mt-4 p-4 bg-neutral-800 rounded-xl text-white">
              <h2 className="text-lg font-semibold mb-2">Output:</h2>
              <pre className="bg-black/40 px-4 py-2 rounded-xl text-gray-200 overflow-x-auto">
                <code>
                  {submissionResult.error || submissionResult.response}
                </code>
              </pre>
            </div>
          )}
        </div>
      </div>
    </Split>
  );
}
