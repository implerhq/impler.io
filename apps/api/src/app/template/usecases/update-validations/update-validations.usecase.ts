import * as fs from 'fs';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { TemplateRepository, ValidatorRepository } from '@impler/dal';
import { UpdateValidationsCommand } from './update-validations.command';
import { DocumentNotFoundException } from '@shared/exceptions/document-not-found.exception';
import { SManager, BATCH_LIMIT, MAIN_CODE, EngineResponseStatusEnum } from '@shared/services/sandbox';

@Injectable()
export class UpdateValidations {
  constructor(
    private validatorRepository: ValidatorRepository,
    private templateRepository: TemplateRepository,
    private sandboxManager: SManager
  ) {}

  async execute(_templateId: string, data: UpdateValidationsCommand) {
    const template = await this.templateRepository.findOne({ id: _templateId });
    if (!template) {
      throw new DocumentNotFoundException('Template', _templateId);
    }

    let result: {
      passed: boolean;
      standardOutput: string;
      standardError: string;
    };

    if (data.onBatchInitialize) {
      const output = await this.testCode('test', data.onBatchInitialize);
      if (!output) {
        throw new InternalServerErrorException();
      }
      if (output.output && typeof output.output !== 'string' && output.output.status === EngineResponseStatusEnum.OK) {
        result = {
          passed: true,
          standardError: output.standardError,
          standardOutput: output.standardOutput,
        };
      } else {
        result = {
          passed: false,
          standardError: output.standardError,
          standardOutput: output.standardOutput,
        };
      }
    }

    if (!data.onBatchInitialize || result?.passed) {
      await this.validatorRepository.findOneAndUpdate(
        {
          _templateId,
        },
        {
          _templateId,
          ...data,
        },
        {
          upsert: true,
        }
      );

      await this.validatorRepository.findOne({ _templateId });
    }

    return result;
  }

  async testCode(id: string, onBatchInitialize: string) {
    const sandbox = await this.sandboxManager.obtainSandbox(id);
    sandbox.clean();
    const sandboxPath = sandbox.getSandboxFolderPath();

    if (!fs.existsSync(sandboxPath)) {
      await sandbox.init();
    }

    fs.writeFileSync(
      `${sandboxPath}/input.json`,
      JSON.stringify({
        uploadId: id,
        data: [],
        batchCount: 0,
        extra: {},
        sandboxPath: sandboxPath,
        chunkSize: BATCH_LIMIT,
      })
    );
    fs.writeFileSync(`${sandboxPath}/code.js`, onBatchInitialize);
    fs.writeFileSync(`${sandboxPath}/main.js`, MAIN_CODE);

    const nodeExecutablePath = process.execPath;

    return await sandbox.runCommandLine(`${nodeExecutablePath} main.js`);
  }
}
