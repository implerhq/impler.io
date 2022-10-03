import { NotFoundException } from '@nestjs/common';

export class DocumentNotFoundException extends NotFoundException {
  constructor(name: string, id: string) {
    super(`${name} with id ${id} does not exist`);
  }
}
