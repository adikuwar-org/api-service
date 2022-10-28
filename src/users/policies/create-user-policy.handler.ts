import { Users } from 'src/users/schemas/users.schema';
import { Action, AppAbility } from '../../casl/casl-ability.factory';
import { IPolicyHandler } from '../../casl/policy-handler';

export class CreateUserPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility): boolean {
    return ability.can(Action.Create, Users);
  }
}
