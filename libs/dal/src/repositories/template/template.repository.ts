import { BaseRepository } from '../base-repository';
import { TemplateEntity } from './template.entity';
import { Template } from './template.schema';

export class TemplateRepository extends BaseRepository<TemplateEntity> {
  constructor() {
    super(Template, TemplateEntity);
  }
}
