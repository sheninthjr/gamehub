import { randomBytes } from "crypto";
import { Language, LanguageExtension } from "../types";
import { Runner } from "../problems";

export function generateRandomString(length: number): string {
  return randomBytes(length).toString("hex");
}

export function getFileExtension(language: Language): LanguageExtension {
  switch (language) {
    case "python":
      return "py";
    case "cpp":
      return "cpp";
    case "java":
      return "java";
    default:
      throw new Error("Unsupported Language");
  }
}

export function isDangerousCode(code: string): boolean {
  const pattern = [
    /system\(/,
    /exec\(/,
    /child_process/,
    /fs\./,
    /process\.exit/,
    /require\(/,
    /__dirname/,
    /eval\(/,
    /os\./,
    /native/,
    /process\./,
  ];
  return pattern.some((p) => p.test(code));
}

export function finalCode(
  code: string,
  language: Language,
  problemId: string,
): string {
  const problem = Runner.find((p) => p.id === problemId);
  if (!problem) {
    throw new Error("Problem Doesn't exits");
  }
  const runnerCode = problem.runnerCode[language];
  if (!runnerCode) {
    throw new Error("No runner logic is avaiable for this code");
  }
  switch (language) {
    case "python":
      return `${code}\n${runnerCode}`;
    case "cpp":
      const imports = `#include<bits/stdc++.h>\n`;
      return `${imports}\n${code}\n\n${runnerCode}`;
    case "java":
      const mainMethod = `\n      ${runnerCode}`;
      return code.replace(/}$/, mainMethod + "\n}");
    default:
      throw new Error("Unsupported Language");
  }
}

export function getDockerImage(language: Language): string {
  switch (language) {
    case "python":
      return "python:3.13.1-alpine3.21";
    case "java":
      return "openjdk:24-jdk-slim";
    case "cpp":
      return "gcc";
    default:
      throw new Error("Docker image not supported for this language");
  }
}

export function getClassName(code: string): string {
  const match = code.match(/public\s+class\s+(\w+)/);
  if (match) return match[1];
  throw new Error("No class found");
}
