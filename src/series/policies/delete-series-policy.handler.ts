import { Action, AppAbility } from 'src/casl/casl-ability.factory';
import { IPolicyHandler } from 'src/casl/policy-handler';
import { Series } from '../schemas/series.schema';

export class DeleteSeriesPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility): boolean {
    return ability.can(Action.Delete, Series);
  }
}
