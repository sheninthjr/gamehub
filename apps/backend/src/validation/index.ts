import fs from "fs";
import path from "path";
import { Language } from "../types";
import { getClassName, getDockerImage } from "../utils";
import { promisify } from "util";
import { exec } from "child_process";
import { Runner } from "../problems";

export async function runDockerContainer(
  sourceFile: string,
  execFile: string,
  language: Language
): Promise<string> {
  const dockerImage = getDockerImage(language);
  const tempDir = path.dirname(sourceFile);
  const sourceFileName = path.basename(sourceFile);
  const execFileName = path.basename(execFile);
  let dockerRunCommand;
  if (language === "cpp") {
    dockerRunCommand = `docker run --rm --network none \
            --memory=512m \
            --cpu-quota=50000 \
            --security-opt=no-new-privileges:true \
            -v ${tempDir}:/usr/src/app \
            -w /usr/src/app \
            ${dockerImage} \
            sh -c "g++ ${sourceFileName} -o ${execFileName} && timeout 5s ./${execFileName}"
        `;
  } else if (language === "java") {
    const fileContent = fs.readFileSync(sourceFile, "utf-8");
    const className = getClassName(fileContent);
    const javaFileName = `${className}.java`;
    const newFilePath = path.join(tempDir, javaFileName);
    fs.renameSync(sourceFile, newFilePath);
    dockerRunCommand = `docker run --rm --network none \
            --memory=512m \
            --cpu-quota=50000 \
            --security-opt=no-new-privileges:true \
            -v ${tempDir}:/usr/src/app \
            -w /usr/src/app \
            ${dockerImage} \
            sh -c "javac ${javaFileName} && timeout 5s java -cp /usr/src/app ${className}"
        `;
  } else {
    dockerRunCommand = `docker run --rm --network none \
        --memory=512m \
        --cpu-quota=50000 \
        --security-opt=no-new-privileges:true \
        -v ${tempDir}:/usr/src/app \
        -w /usr/src/app \
        ${dockerImage} \
        timeout 5s python3 ${sourceFileName}
        `;
  }
  try {
    const execProm = promisify(exec);
    const { stdout, stderr } = await execProm(dockerRunCommand);

    if (stderr && !stderr.includes("Command terminated by timeout")) {
      console.error(`Docker stderr: ${stderr}`);
      throw new Error(`Error executing in Docker: ${stderr}`);
    }
    return stdout;
  } catch (error) {
    console.error("Docker execution failed:", error);
    throw new Error(`Docker execution failed: ${error}`);
  }
}

export function evaluateProblem(stdout: string, problemId: string) {
  const problem = Runner.find((r) => r.id === problemId);
  const outputLines = stdout.trim().split("\n");
  const testCases = problem?.testCases;

  const testResults = testCases.map((testcase: any, index: number) => {
    const output = outputLines[index];
    const expectedOutput = problem?.expectedOutputs[index];
    return {
      no: index + 1,
      input: testcase,
      passed: verifyTestCases(output, expectedOutput, problem?.type),
    };
  });

  const passedTestCases = testResults.filter((r: any) => r.passed).length;

  return {
    problemId,
    status: passedTestCases === testCases.length ? "Accepted" : "Wrong Answer",
    totalTestCases: testCases.length,
    passedTestCases: passedTestCases,
    testResults: testResults,
  };
}

export function verifyTestCases(
  output: string,
  expectedOutput: any,
  type: any
): boolean {
  if (!output) return false;
  if (type === "numberarray") {
    const res = JSON.parse(output.trim()).map((x: any) =>
      Array.isArray(x) ? x.map(Number) : Number(x)
    );
    return res.every(
      (value: any, index: any) => value === expectedOutput[index]
    );
  }
  const res =
    type === "number"
      ? output.trim().split(/\s+/).map(Number)
      : output.trim().split(/\s+/);
  return res.every((value, index) => value === expectedOutput[index]);
}
