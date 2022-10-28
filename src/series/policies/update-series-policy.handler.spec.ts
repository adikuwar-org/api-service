import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Roles } from 'src/users/schemas/users.schema';
import { UpdateSeriesPolicyHandler } from './update-series-policy.handler';

describe('UpdateSeriesPolicyHandler', () => {
  it('should be defined', () => {
    expect(new UpdateSeriesPolicyHandler()).toBeDefined();
  });

  describe('UpdateSeriesPolicyHandler.handle', () => {
    let user;
    let abilityFactory: CaslAbilityFactory;
    let handler: UpdateSeriesPolicyHandler;

    beforeEach(() => {
      user = {
        id: 'id',
        userName: 'username',
        firstName: 'firstName',
        lastName: 'lastName',
        role: Roles.Administrator,
      };
      abilityFactory = new CaslAbilityFactory();
      handler = new UpdateSeriesPolicyHandler();
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
