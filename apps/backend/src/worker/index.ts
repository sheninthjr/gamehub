import path from 'path';
import fs from 'fs';
import { finalCode, generateRandomString, getFileExtension, isDangerousCode } from '../utils';
import { Language } from '../types';
import { evaluateProblem, runDockerContainer } from '../validation';

export function Worker(code:string,language:Language,problemId:string) {
  return new Promise((resolve,reject) => {
    const problemDir = path.resolve(__dirname,"../problemcache");
    const tempDir = path.join(problemDir,generateRandomString(16));
    try {
      fs.mkdirSync(tempDir, { recursive : true });
    } catch (error) {
      return {
        message: "Error while creating folder"
      }
    }
    const sourceFile = path.join(tempDir,`code.${getFileExtension(language)}`)
    const execFile = path.join(tempDir,"code");
    if(isDangerousCode(code)) {
      return {
        message: "Your code is Malicious"
      }
    }
    const fullCode = finalCode(code,language,problemId);
    fs.writeFileSync(sourceFile,fullCode);
    runDockerContainer(sourceFile,execFile,language).then((stdout) => {
      const problemEvalution = evaluateProblem(stdout,problemId);
      resolve(problemEvalution);
    }).catch((e) => {
      reject(e);
    }).finally(() => {
      cleanUp(tempDir,sourceFile,execFile,language);
    })
  })
}

function cleanUp(tempDir:string,sourceFile:string,execFile:string,language:Language) {
  try {
    if(fs.existsSync(sourceFile)) {
      fs.unlinkSync(sourceFile)
    }
    if(language === "cpp" && fs.unlinkSync(execFile)) {
      fs.unlinkSync(execFile);
    }
    if(fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, {
        recursive: true,
        force: true
      })
    }
  } catch (error) {
    console.error("Error during cleanup");
  }
}