import * as fs from 'fs';
import { ExecOptions } from 'node:child_process';
import { Injectable } from '@nestjs/common';
import { arch, cwd } from 'node:process';
import { exec } from 'node:child_process';
import * as path from 'node:path';
import * as AsynMutex from 'async-mutex';

const getIsolateExecutableName = () => {
  const defaultName = 'isolate';
  const executableNameMap: Record<string, string> = {
    arm: 'isolate-arm',
    arm64: 'isolate-arm',
  };

  return executableNameMap[arch] ?? defaultName;
};
export enum ExecutionModeEnum {
  SANDBOXED = 'SANDBOXED',
  UNSANDBOXED = 'UNSANDBOXED',
}
export enum EngineResponseStatusEnum {
  OK = 'OK',
  ERROR = 'ERROR',
  TIMEOUT = 'TIMEOUT',
}
export type EngineResponse<T> = {
  status: EngineResponseStatusEnum;
  output: T;
};
export type ExecuteIsolateResult = {
  output: unknown;
  timeInSeconds: number;
  verdict: EngineResponseStatusEnum;
  standardOutput: string;
  standardError: string;
};
const executionMode: ExecutionModeEnum = (process.env.EXECUTION_MODE ||
  ExecutionModeEnum.UNSANDBOXED) as ExecutionModeEnum;

type PnpmCoreCommand = 'add' | 'init' | 'link';
type PnpmDependencyCommand = 'tsc';
type PnpmCommand = PnpmCoreCommand | PnpmDependencyCommand;

export class Sandbox {
  private static readonly isolateExecutableName = getIsolateExecutableName();
  private static readonly sandboxRunTimeSeconds = 10;

  public readonly boxId: number;
  public used: boolean;
  public cached: boolean;
  public resourceId: string | null;
  public lastUsed: number;
  public isDependenciesInstalled = false;

  constructor(request?: {
    boxId: number;
    used: boolean;
    resourceId: string | null;
    lastUsed: number;
    cached: boolean;
  }) {
    if (!request) {
      return;
    }
    this.boxId = request.boxId;
    this.used = request.used;
    this.cached = request.cached;
    this.resourceId = request.resourceId;
    this.lastUsed = request.lastUsed;
  }

  async init() {
    if (executionMode === ExecutionModeEnum.UNSANDBOXED) {
      const sandboxFolderPath = this.getSandboxFolderPath();
      fs.mkdirSync(sandboxFolderPath, { recursive: true });
    } else {
      await Sandbox.runIsolate('--box-id=' + this.boxId + ' --init');
      await this.executePnpm(this.getSandboxFolderPath(), 'init');
      await this.executePnpm(this.getSandboxFolderPath(), 'add', 'axios', '--save');
    }
  }

  async executePnpm(directory: string, command: PnpmCommand, ...args: string[]) {
    return new Promise((resolve, reject) => {
      const fullCommand = `npx pnpm ${command} ${args.join(' ')}`;

      const execOptions: ExecOptions = {
        cwd: directory,
      };
      exec(fullCommand, execOptions, (error, stdoutput, stderr) => {
        if (error) {
          reject(error);

          return;
        }

        if (stderr) {
          reject(error);
        }

        resolve({ verdict: EngineResponseStatusEnum.OK });
      });
    });
  }

  getSandboxFolderPath(): string {
    if (executionMode === ExecutionModeEnum.UNSANDBOXED) {
      const sanboxPath = path.join(__dirname, './sandbox/' + this.boxId);
      if (!fs.existsSync(sanboxPath)) {
        fs.mkdirSync(sanboxPath, {
          recursive: true,
        });
      }

      return sanboxPath;
    }

    return '/var/local/lib/isolate/' + this.boxId + '/box';
  }

  private checkFileExists(filePath: string): boolean {
    try {
      fs.accessSync(filePath, fs.constants.R_OK);

      return true;
    } catch (error) {
      return false;
    }
  }

  private getSandboxFilePath(subFile: string) {
    return this.getSandboxFolderPath() + '/' + subFile;
  }

  private async runUnsafeCommand(cmd: string): Promise<{
    verdict: EngineResponseStatusEnum;
  }> {
    const standardOutputPath = this.getSandboxFilePath('_standardOutput.txt');
    const standardErrorPath = this.getSandboxFilePath('_standardError.txt');

    fs.writeFileSync(standardOutputPath, '');
    fs.writeFileSync(standardErrorPath, '');

    return new Promise((resolve, reject) => {
      const process = exec(cmd, async (error, stdout: string | PromiseLike<string>, stderr) => {
        if (error) {
          reject(error);

          return;
        }

        if (stdout) {
          fs.appendFileSync(standardOutputPath, await stdout);
        }

        if (stderr) {
          fs.appendFileSync(standardErrorPath, stderr);
        }

        resolve({ verdict: EngineResponseStatusEnum.OK });
      });

      setTimeout(() => {
        process.kill();
        resolve({ verdict: EngineResponseStatusEnum.TIMEOUT });
      }, Sandbox.sandboxRunTimeSeconds * 1000);
    });
  }

  private async parseFunctionOutput(): Promise<EngineResponse<unknown>> {
    const outputFile = this.getSandboxFilePath('output.json');
    try {
      const ouputContent = fs.readFileSync(outputFile, { encoding: 'utf-8' });

      return JSON.parse(ouputContent);
    } catch (error) {
      throw new Error('Output file not found in ' + outputFile);
    }
  }

  private static runIsolate(cmd: string): Promise<string> {
    const currentDir = cwd();
    const fullCmd = `${currentDir}/src/config/${this.isolateExecutableName} ${cmd}`;

    return new Promise((resolve, reject) => {
      exec(fullCmd, (error, stdout: string | PromiseLike<string>, stderr) => {
        if (error) {
          reject(error);

          return;
        }
        if (stderr) {
          resolve(stderr);

          return;
        }
        resolve(stdout);
      });
    });
  }

  async clean(): Promise<void> {
    const filesToDelete = [
      '_standardOutput.txt',
      '_standardError.txt',
      'output.json',
      'input.json',
      'code.js',
      'meta.txt',
    ];
    filesToDelete.map((file: string) => {
      const filePath = this.getSandboxFilePath(file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
  }

  async addDependencies(directory: string) {
    if (!this.isDependenciesInstalled) {
      exec(`npm init -y`, { cwd: directory });
      exec(`npm i axios`, {
        cwd: directory,
      });
      /*
       * exec(`npm run --script start "node main.js"`, { cwd: directory });
       * exec(`pnpm install`, { cwd: directory });
       */
      this.isDependenciesInstalled = true;
    }
  }

  async recreate(): Promise<void> {
    const sandboxFolderPath = this.getSandboxFolderPath();
    if (executionMode === ExecutionModeEnum.UNSANDBOXED) {
      try {
        fs.rmdirSync(sandboxFolderPath, { recursive: true });
      } catch (error) {
        // ignored
      }
      fs.mkdirSync(sandboxFolderPath, { recursive: true });
    } else {
      await Sandbox.runIsolate('--box-id=' + this.boxId + ' --cleanup');
      await Sandbox.runIsolate('--box-id=' + this.boxId + ' --init');
    }
    await this.addDependencies(sandboxFolderPath);
  }

  async runCommandLine(commandLine: string): Promise<ExecuteIsolateResult> {
    if (executionMode === ExecutionModeEnum.UNSANDBOXED) {
      const startTime = Date.now();
      const result = await this.runUnsafeCommand(
        `cd ${this.getSandboxFolderPath()} && NODE_OPTIONS='--enable-source-maps' ${commandLine}`
      );
      let engineResponse;
      if (result.verdict === EngineResponseStatusEnum.OK) {
        engineResponse = await this.parseFunctionOutput();
      }

      return {
        timeInSeconds: (Date.now() - startTime) / 1000,
        verdict: result.verdict,
        output: engineResponse,
        standardOutput: fs.readFileSync(this.getSandboxFilePath('_standardOutput.txt'), {
          encoding: 'utf-8',
        }),
        standardError: fs.readFileSync(this.getSandboxFilePath('_standardError.txt'), { encoding: 'utf-8' }),
      };
    } else {
      try {
        const metaFile = this.getSandboxFilePath('meta.txt');
        const etcDir = path.resolve('./src/config/etc/');

        await Sandbox.runIsolate(
          `--dir=/usr/bin/ --dir=/etc/=${etcDir} --share-net --box-id=` +
            this.boxId +
            ` --processes --wall-time=${Sandbox.sandboxRunTimeSeconds} --meta=` +
            metaFile +
            ' --stdout=_standardOutput.txt' +
            ' --stderr=_standardError.txt --run ' +
            ' --env=HOME=/tmp/' +
            " --env=NODE_OPTIONS='--enable-source-maps' " +
            commandLine
        );

        let timeInSeconds = 0;
        if (this.checkFileExists(this.getSandboxFilePath('meta.txt'))) {
          const metaResult = await this.parseMetaFile();
          timeInSeconds = Number.parseFloat(metaResult.time as string);
        }

        const isOutputFileExists = fs.existsSync(this.getSandboxFilePath('output.json'));

        const result = {
          timeInSeconds,
          verdict: EngineResponseStatusEnum.OK,
          output: isOutputFileExists ? await this.parseFunctionOutput() : '',
          standardOutput: fs.readFileSync(this.getSandboxFilePath('_standardOutput.txt'), {
            encoding: 'utf-8',
          }),
          standardError: fs.readFileSync(this.getSandboxFilePath('_standardError.txt'), { encoding: 'utf-8' }),
        };

        return result;
      } catch (e) {
        throw new Error(e.message);
      }
    }
  }

  async parseMetaFile(): Promise<Record<string, unknown>> {
    const metaFile = this.getSandboxFilePath('meta.txt');
    const lines = fs.readFileSync(metaFile, { encoding: 'utf-8' }).split('\n');
    const result: Record<string, unknown> = {};

    lines.forEach((line: string) => {
      const parts = line.split(':');
      result[parts[0]] = parts[1];
    });

    return result;
  }
}

@Injectable()
export class SManager {
  private static _instance?: SManager;

  private readonly sanboxes = new Map<number, Sandbox>();
  private readonly mutex: AsynMutex.Mutex = new AsynMutex.Mutex();

  constructor() {
    for (let boxId = 0; boxId < 100; ++boxId) {
      this.sanboxes.set(
        boxId,
        new Sandbox({
          boxId,
          cached: false,
          used: false,
          resourceId: null,
          lastUsed: 0,
        })
      );
    }
    SManager._instance = this;
  }

  async obtainSandbox(key: string): Promise<Sandbox> {
    // Acquire the lock
    const release = await this.mutex.acquire();

    // Find the sandbox with resourceId equal to key and not used
    const sandbox = Array.from(this.sanboxes.values()).find((sbox) => sbox.resourceId === key && !sbox.used);
    if (sandbox) {
      sandbox.used = true;
      sandbox.lastUsed = Date.now();
      sandbox.cached = true;

      release();

      return sandbox;
    }

    const oldestSandbox = Array.from(this.sanboxes.values()).reduce((prev, curr) => {
      return prev.lastUsed < curr.lastUsed ? prev : curr;
    });
    if (oldestSandbox === null) {
      new Error('No Sandbox available');
    }
    oldestSandbox.lastUsed = Date.now();
    oldestSandbox.used = true;
    oldestSandbox.cached = false;
    oldestSandbox.resourceId = key;
    // oldestSandbox.addDependencies(oldestSandbox.getSandboxFolderPath());

    release();

    return oldestSandbox;
  }

  async returnSandbox(sandboxId: number): Promise<void> {
    const release = await this.mutex.acquire();
    const sandbox = this.sanboxes.get(sandboxId);
    if (!sandbox) throw new Error('Sandbox not found');
    sandbox.used = false;
    release();
  }

  static get instance(): SManager {
    return SManager._instance ?? (SManager._instance = new SManager());
  }
}
