import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Roles } from '../schemas/users.schema';
import { UpdateUserPolicyHandler } from './update-user-policy.handler';

describe('UpdateUserPolicyHandler', () => {
  it('should be defined', () => {
    expect(new UpdateUserPolicyHandler()).toBeDefined();
  });

  describe('UpdateUserPolicyHandler', () => {
    let user;
    let abilityFactory: CaslAbilityFactory;
    let handler: UpdateUserPolicyHandler;

    beforeEach(() => {
      user = {
        id: 'id',
        userName: 'username',
        firstName: 'firstName',
        lastName: 'lastName',
        role: Roles.Administrator,
      };
      abilityFactory = new CaslAbilityFactory();
      handler = new UpdateUserPolicyHandler();
    });

    it('should return true for administrator', () => {
      const ability = abilityFactory.createForUser(user);
      expect(handler.handle(ability)).toEqual(true);
    });

    it('should return true for manager', () => {
      user.role = Roles.Manager;
      const ability = abilityFactory.createForUser(user);
      expect(handler.handle(ability)).toEqual(true);
    });

    it('should return false for author', () => {
      user.role = Roles.Author;
      const ability = abilityFactory.createForUser(user);
      expect(handler.handle(ability)).toEqual(false);
    });

    it('should return false for viewer', () => {
      user.role = Roles.Viewer;
      const ability = abilityFactory.createForUser(user);
      expect(handler.handle(ability)).toEqual(false);
    });
  });
});
