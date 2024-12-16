import { exec } from "child_process";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { mkdirSync, rmdirSync, unlinkSync } from "fs";
import { promisify } from "util";

export function Worker(code: string, language: string) {
  return new Promise((resolve, reject) => {
    const problemCacheDir = path.resolve(__dirname, "../problemcache");
    const tempDir = path.join(problemCacheDir, generateRandomString(16));

    try {
      mkdirSync(tempDir, { recursive: true });
    } catch (err) {
      console.error("Error creating temp directory:", err);
      return reject(new Error("Failed to create temporary directory."));
    }

    const sourceFileName = path.join(
      tempDir,
      `temp_code.${getFileExtension(language)}`,
    );
    const execFileName = path.join(tempDir, `temp_code`);

    if (isDangerousCode(code)) {
      console.error("Malicious code detected");
      return reject(new Error("Execution of dangerous code is not allowed."));
    }

    fs.writeFileSync(sourceFileName, code);
    runDockerContainer(sourceFileName, execFileName, language)
      .then((stdout) => {
        resolve(stdout);
      })
      .catch((error) => {
        reject(error);
      })
      .finally(() => {
        cleanupTempFiles(tempDir, sourceFileName, execFileName, language);
      });
  });
}

function isDangerousCode(code: string): boolean {
  const dangerousPatterns = [
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
  return dangerousPatterns.some((pattern) => pattern.test(code));
}

function generateRandomString(length: number): string {
  return crypto.randomBytes(length).toString("hex");
}

function getFileExtension(language: string): string {
  switch (language) {
    case "python":
      return "py";
    case "javascript":
      return "js";
    case "cpp":
      return "cpp";
    default:
      throw new Error("Unsupported language");
  }
}

async function runDockerContainer(
  sourceFile: string,
  execFile: string,
  language: string,
): Promise<string> {
  const dockerImage = getDockerImage(language);
  const tempDir = path.dirname(sourceFile);
  const sourceFileName = path.basename(sourceFile);
  const execFileName = path.basename(execFile);
  let dockerRunCommand = "";
  if (language === "cpp") {
    dockerRunCommand = `docker run --rm \
      --network none \
      --memory=512m \
      --cpu-quota=50000 \
      --security-opt=no-new-privileges:true \
      -v ${tempDir}:/usr/src/app \
      -w /usr/src/app \
      ${dockerImage} \
      sh -c "g++ ${sourceFileName} -o ${execFileName} && timeout 5s ./${execFileName}"`;
  } else {
    dockerRunCommand = `docker run --rm \
      --network none \
      --memory=512m \
      --cpu-quota=50000 \
      --security-opt=no-new-privileges:true \
      -v ${tempDir}:/usr/src/app \
      -w /usr/src/app \
      ${dockerImage} \
      timeout 5s ${getInterpreterCommand(language)} ${sourceFileName}`;
  }

  console.log(`Running Docker container with the command: ${dockerRunCommand}`);

  try {
    const execProm = promisify(exec);
    const { stdout, stderr } = await execProm(dockerRunCommand);

    if (stderr && !stderr.includes("Command terminated by timeout")) {
      console.error(`Docker stderr: ${stderr}`);
      throw new Error(`Error executing in Docker: ${stderr}`);
    }

    console.log(`Docker stdout: ${stdout}`);
    return stdout;
  } catch (error) {
    console.error("Docker execution failed:", error);
    throw new Error(`Docker execution failed: ${error}`);
  }
}

function getInterpreterCommand(language: string): string {
  switch (language) {
    case "python":
      return "python3";
    case "javascript":
      return "node";
    default:
      throw new Error("Unsupported language");
  }
}

function getDockerImage(language: string): string {
  switch (language) {
    case "python":
      return "python:3.13.1-alpine3.21";
    case "javascript":
      return "node:14-slim";
    case "cpp":
      return "gcc:latest";
    default:
      throw new Error("Unsupported language for Docker execution");
  }
}

function cleanupTempFiles(
  tempDir: any,
  sourceFileName: any,
  execFileName: any,
  language: any,
) {
  try {
    console.log("Attempting to clean up temporary files and directories...");
    if (fs.existsSync(sourceFileName)) {
      unlinkSync(sourceFileName);
      console.log(`Deleted source file: ${sourceFileName}`);
    } else {
      console.warn(`Source file not found: ${sourceFileName}`);
    }
    if (language === "cpp" && fs.existsSync(execFileName)) {
      unlinkSync(execFileName);
      console.log(`Deleted exec file: ${execFileName}`);
    }
    if (fs.existsSync(tempDir)) {
      rmdirSync(tempDir, { recursive: true });
      console.log(`Deleted temp directory: ${tempDir}`);
    } else {
      console.warn(`Temp directory not found: ${tempDir}`);
    }
  } catch (err) {
    console.error("Error during cleanup:", err);
  }
}
