import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Roles } from '../schemas/users.schema';
import { ReadUserPolicyHandler } from './read-user-policy.handler';

describe('ReadUserPolicyHandler', () => {
  it('should be defined', () => {
    expect(new ReadUserPolicyHandler()).toBeDefined();
  });

  describe('ReadUserPolicyHandler.handle', () => {
    let user;
    let abilityFactory: CaslAbilityFactory;
    let handler: ReadUserPolicyHandler;

    beforeEach(() => {
      user = {
        id: 'id',
        userName: 'username',
        firstName: 'firstName',
        lastName: 'lastName',
        role: Roles.Administrator,
      };
      abilityFactory = new CaslAbilityFactory();
      handler = new ReadUserPolicyHandler();
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

    it('should return true for author', () => {
      user.role = Roles.Author;
      const ability = abilityFactory.createForUser(user);
      expect(handler.handle(ability)).toEqual(true);
    });

    it('should return true for viewer', () => {
      user.role = Roles.Viewer;
      const ability = abilityFactory.createForUser(user);
      expect(handler.handle(ability)).toEqual(true);
    });
  });
});
