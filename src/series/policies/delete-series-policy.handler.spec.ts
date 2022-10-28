import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Roles } from 'src/users/schemas/users.schema';
import { DeleteSeriesPolicyHandler } from './delete-series-policy.handler';

describe('DeleteSeriesPolicyHandler', () => {
  it('should be defined', () => {
    expect(new DeleteSeriesPolicyHandler()).toBeDefined();
  });

  describe('DeleteSeriesPolicyHandler.handle', () => {
    let user;
    let caslAbilityFactory: CaslAbilityFactory;
    let handler: DeleteSeriesPolicyHandler;
    beforeEach(() => {
      user = {
        id: 'id',
        userName: 'username',
        firstName: 'firstName',
        lastName: 'lastName',
        role: Roles.Administrator,
      };
      caslAbilityFactory = new CaslAbilityFactory();
      handler = new DeleteSeriesPolicyHandler();
    });

    it('should return true for administrator', () => {
      const ability = caslAbilityFactory.createForUser(user);
      expect(handler.handle(ability)).toEqual(true);
    });

    it('should return false for manager', () => {
      user.role = Roles.Manager;
      const ability = caslAbilityFactory.createForUser(user);
      expect(handler.handle(ability)).toEqual(false);
    });

    it('should return false for author', () => {
      user.role = Roles.Author;
      const ability = caslAbilityFactory.createForUser(user);
      expect(handler.handle(ability)).toEqual(false);
    });

    it('should return false for viewer', () => {
      user.role = Roles.Viewer;
      const ability = caslAbilityFactory.createForUser(user);
      expect(handler.handle(ability)).toEqual(false);
    });
  });
});
