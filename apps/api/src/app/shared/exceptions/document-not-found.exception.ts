import { NotFoundException } from '@nestjs/common';

export class DocumentNotFoundException extends NotFoundException {
  constructor(name: string, id: string, message?: string) {
    super(message || `${name} with id ${id} does not exist`);
  }
}
