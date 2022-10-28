import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Roles } from '../schemas/users.schema';
import { DeleteUserPolicyHandler } from './delete-user-policy.handler';

describe('DeleteUserPolicyHandler', () => {
  it('should be defined', () => {
    expect(new DeleteUserPolicyHandler()).toBeDefined();
  });

  describe('DeleteUserPolicyHandler.handle', () => {
    let user;
    let abilityFactory: CaslAbilityFactory;
    let handler: DeleteUserPolicyHandler;

    beforeEach(() => {
      user = {
        id: 'id',
        userName: 'username',
        firstName: 'firstName',
        lastName: 'lastName',
        role: Roles.Administrator,
      };
      abilityFactory = new CaslAbilityFactory();
      handler = new DeleteUserPolicyHandler();
    });

    it('should return true for administrator', () => {
      const abilitiy = abilityFactory.createForUser(user);
      expect(handler.handle(abilitiy)).toEqual(true);
    });

    it('should return false for manager', () => {
      user.role = Roles.Manager;
      const abilitiy = abilityFactory.createForUser(user);
      expect(handler.handle(abilitiy)).toEqual(false);
    });

    it('should return false for author', () => {
      user.role = Roles.Author;
      const abilitiy = abilityFactory.createForUser(user);
      expect(handler.handle(abilitiy)).toEqual(false);
    });

    it('should return false for viewer', () => {
      user.role = Roles.Viewer;
      const abilitiy = abilityFactory.createForUser(user);
      expect(handler.handle(abilitiy)).toEqual(false);
    });
  });
});
