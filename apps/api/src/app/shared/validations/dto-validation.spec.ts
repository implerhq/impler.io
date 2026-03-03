import { expect } from 'chai';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { RegisterUserDto } from '../../auth/dtos/register-user.dto';
import { LoginUserDto } from '../../auth/dtos/login-user.dto';
import { CreateUserJobDto } from '../../import-jobs/dtos/create-userjob.dto';
import { UpdateJobDto } from '../../import-jobs/dtos/update-userjob.dto';

describe('DTO Validation Tests', () => {
  describe('RegisterUserDto', () => {
    it('should accept valid registration data', async () => {
      const dto = plainToInstance(RegisterUserDto, {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'secureP@ss1',
      });
      const errors = await validate(dto);
      expect(errors).to.have.length(0);
    });

    it('should reject password shorter than 8 characters', async () => {
      const dto = plainToInstance(RegisterUserDto, {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'short',
      });
      const errors = await validate(dto);
      expect(errors.length).to.be.greaterThan(0);
      const passwordError = errors.find((e) => e.property === 'password');
      expect(passwordError).to.not.be.undefined;
    });

    it('should reject firstName longer than 100 characters', async () => {
      const dto = plainToInstance(RegisterUserDto, {
        firstName: 'A'.repeat(101),
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'securePass1',
      });
      const errors = await validate(dto);
      const nameError = errors.find((e) => e.property === 'firstName');
      expect(nameError).to.not.be.undefined;
    });

    it('should reject invalid email format', async () => {
      const dto = plainToInstance(RegisterUserDto, {
        firstName: 'John',
        lastName: 'Doe',
        email: 'not-an-email',
        password: 'securePass1',
      });
      const errors = await validate(dto);
      const emailError = errors.find((e) => e.property === 'email');
      expect(emailError).to.not.be.undefined;
    });

    it('should reject empty firstName', async () => {
      const dto = plainToInstance(RegisterUserDto, {
        firstName: '',
        lastName: 'Doe',
        email: 'john@example.com',
        password: 'securePass1',
      });
      const errors = await validate(dto);
      expect(errors.length).to.be.greaterThan(0);
    });

    it('should reject email longer than 255 characters', async () => {
      const dto = plainToInstance(RegisterUserDto, {
        firstName: 'John',
        lastName: 'Doe',
        email: 'a'.repeat(250) + '@test.com',
        password: 'securePass1',
      });
      const errors = await validate(dto);
      const emailError = errors.find((e) => e.property === 'email');
      expect(emailError).to.not.be.undefined;
    });
  });

  describe('LoginUserDto', () => {
    it('should accept valid login data', async () => {
      const dto = plainToInstance(LoginUserDto, {
        email: 'john@example.com',
        password: 'securePass',
      });
      const errors = await validate(dto);
      expect(errors).to.have.length(0);
    });

    it('should reject password longer than 128 characters', async () => {
      const dto = plainToInstance(LoginUserDto, {
        email: 'john@example.com',
        password: 'A'.repeat(129),
      });
      const errors = await validate(dto);
      const passwordError = errors.find((e) => e.property === 'password');
      expect(passwordError).to.not.be.undefined;
    });

    it('should reject invalid email', async () => {
      const dto = plainToInstance(LoginUserDto, {
        email: 'invalid',
        password: 'securePass',
      });
      const errors = await validate(dto);
      expect(errors.length).to.be.greaterThan(0);
    });
  });

  describe('CreateUserJobDto', () => {
    it('should accept valid job creation data', async () => {
      const dto = plainToInstance(CreateUserJobDto, {
        webSocketSessionId: 'session-123',
        url: 'https://api.example.com/data',
      });
      const errors = await validate(dto);
      expect(errors).to.have.length(0);
    });

    it('should reject invalid URL', async () => {
      const dto = plainToInstance(CreateUserJobDto, {
        webSocketSessionId: 'session-123',
        url: '://missing-protocol',
      });
      const errors = await validate(dto);
      const urlError = errors.find((e) => e.property === 'url');
      expect(urlError).to.not.be.undefined;
    });

    it('should reject URL longer than 2048 characters', async () => {
      const dto = plainToInstance(CreateUserJobDto, {
        webSocketSessionId: 'session-123',
        url: 'https://example.com/' + 'a'.repeat(2048),
      });
      const errors = await validate(dto);
      const urlError = errors.find((e) => e.property === 'url');
      expect(urlError).to.not.be.undefined;
    });

    it('should accept valid cron expression', async () => {
      const dto = plainToInstance(CreateUserJobDto, {
        webSocketSessionId: 'session-123',
        url: 'https://api.example.com/data',
        cron: '0 12 * * 1',
      });
      const errors = await validate(dto);
      expect(errors).to.have.length(0);
    });

    it('should reject invalid cron expression', async () => {
      const dto = plainToInstance(CreateUserJobDto, {
        webSocketSessionId: 'session-123',
        url: 'https://api.example.com/data',
        cron: 'invalid cron',
      });
      const errors = await validate(dto);
      const cronError = errors.find((e) => e.property === 'cron');
      expect(cronError).to.not.be.undefined;
    });

    it('should reject extra field longer than 100000 characters', async () => {
      const dto = plainToInstance(CreateUserJobDto, {
        webSocketSessionId: 'session-123',
        url: 'https://api.example.com/data',
        extra: 'x'.repeat(100001),
      });
      const errors = await validate(dto);
      const extraError = errors.find((e) => e.property === 'extra');
      expect(extraError).to.not.be.undefined;
    });
  });

  describe('UpdateJobDto', () => {
    it('should accept valid update data', async () => {
      const dto = plainToInstance(UpdateJobDto, {
        url: 'https://api.example.com/updated',
        cron: '30 8 * * *',
      });
      const errors = await validate(dto);
      expect(errors).to.have.length(0);
    });

    it('should reject invalid URL in update', async () => {
      const dto = plainToInstance(UpdateJobDto, {
        url: '://missing-protocol',
      });
      const errors = await validate(dto);
      const urlError = errors.find((e) => e.property === 'url');
      expect(urlError).to.not.be.undefined;
    });

    it('should reject invalid cron in update', async () => {
      const dto = plainToInstance(UpdateJobDto, {
        cron: 'not-a-cron',
      });
      const errors = await validate(dto);
      const cronError = errors.find((e) => e.property === 'cron');
      expect(cronError).to.not.be.undefined;
    });
  });
});
