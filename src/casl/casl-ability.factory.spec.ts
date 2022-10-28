import { Series } from 'src/series/schemas/series.schema';
import { Roles, Users } from 'src/users/schemas/users.schema';
import { Action, CaslAbilityFactory } from './casl-ability.factory';

describe('CaslAbilityFactory', () => {
  it('should be defined', () => {
    expect(new CaslAbilityFactory()).toBeDefined();
  });

  describe('CaslAbilityFactory.createForUser', () => {
    let user;
    beforeEach(() => {
      user = {
        id: 'id',
        userName: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        role: Roles.Administrator,
      };
    });
    it('should test administrator abilities', () => {
      const caslAbilityFactory = new CaslAbilityFactory();
      const ability = caslAbilityFactory.createForUser(user);

      expect(ability.can(Action.Manage, 'all')).toEqual(true);
    });

    it('should test manager abilities', () => {
      user.role = Roles.Manager;
      const caslAbilityFactory = new CaslAbilityFactory();
      const ability = caslAbilityFactory.createForUser(user);

      expect(ability.can(Action.Create, 'all')).toEqual(true);
      expect(ability.can(Action.Update, 'all')).toEqual(true);
      expect(ability.can(Action.Read, 'all')).toEqual(true);
      expect(ability.can(Action.Manage, 'all')).toEqual(false);
      expect(ability.can(Action.Delete, Users)).toEqual(false);
      expect(ability.can(Action.Delete, Series)).toEqual(false);
    });

    it('should test author abilities', () => {
      user.role = Roles.Author;
      const caslAbilityFactory = new CaslAbilityFactory();
      const ability = caslAbilityFactory.createForUser(user);

      expect(ability.can(Action.Read, 'all')).toEqual(true);
      expect(ability.can(Action.Create, Users)).toEqual(false);
      expect(ability.can(Action.Create, Series)).toEqual(false);
      expect(ability.can(Action.Update, Users)).toEqual(false);
      expect(ability.can(Action.Update, Series)).toEqual(false);
      expect(ability.can(Action.Delete, Users)).toEqual(false);
      expect(ability.can(Action.Delete, Series)).toEqual(false);
    });

    it('should test viewer abilities', () => {
      user.role = Roles.Viewer;
      const caslAbilityFactory = new CaslAbilityFactory();
      const ability = caslAbilityFactory.createForUser(user);

      expect(ability.can(Action.Read, 'all')).toEqual(true);
      expect(ability.can(Action.Create, Users)).toEqual(false);
      expect(ability.can(Action.Create, Series)).toEqual(false);
      expect(ability.can(Action.Update, Users)).toEqual(false);
      expect(ability.can(Action.Update, Series)).toEqual(false);
      expect(ability.can(Action.Delete, Users)).toEqual(false);
      expect(ability.can(Action.Delete, Series)).toEqual(false);
    });
  });
});
