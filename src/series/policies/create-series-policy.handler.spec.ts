import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Roles } from 'src/users/schemas/users.schema';
import { CreateSeriesPolicyHandler } from './create-series-policy.handler';

describe('SeriesPolicyHandler', () => {
  it('should be defined', () => {
    expect(new CreateSeriesPolicyHandler()).toBeDefined();
  });

  describe('SeriesPolicyHandler.handle', () => {
    let user;
    let caslAbilityFactory: CaslAbilityFactory;
    let createSeriesPolicyHandler: CreateSeriesPolicyHandler;
    beforeEach(() => {
      user = {
        id: 'id',
        userName: 'username',
        firstName: 'firstName',
        lastName: 'lastName',
        role: Roles.Administrator,
      };
      caslAbilityFactory = new CaslAbilityFactory();
      createSeriesPolicyHandler = new CreateSeriesPolicyHandler();
    });

    it('should return true for administrator', () => {
      const ability = caslAbilityFactory.createForUser(user);
      expect(createSeriesPolicyHandler.handle(ability)).toEqual(true);
    });

    it('should return true for manager', () => {
      user.role = Roles.Manager;
      const ability = caslAbilityFactory.createForUser(user);
      expect(createSeriesPolicyHandler.handle(ability)).toEqual(true);
    });

    it('should return false for author', () => {
      user.role = Roles.Author;
      const ability = caslAbilityFactory.createForUser(user);
      expect(createSeriesPolicyHandler.handle(ability)).toEqual(false);
    });

    it('should return false for viewer', () => {
      user.role = Roles.Viewer;
      const ability = caslAbilityFactory.createForUser(user);
      expect(createSeriesPolicyHandler.handle(ability)).toEqual(false);
    });
  });
});
