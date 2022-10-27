import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Roles } from 'src/users/schemas/users.schema';
import { ReadSeriesPolicyHandler } from './read-series-policy.handler';

describe('ReadSeriesPolicyHandler', () => {
  it('should be defined', () => {
    expect(new ReadSeriesPolicyHandler()).toBeDefined();
  });

  describe('ReadSeriesPolicyHandler.handle', () => {
    let user;
    let abilityFactory: CaslAbilityFactory;
    let handler: ReadSeriesPolicyHandler;

    beforeEach(() => {
      user = {
        id: 'id',
        userName: 'username',
        firstName: 'firstName',
        lastName: 'lastName',
        role: Roles.Administrator,
      };
      abilityFactory = new CaslAbilityFactory();
      handler = new ReadSeriesPolicyHandler();
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
