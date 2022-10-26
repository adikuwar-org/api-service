import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import {
  AbilityBuilder,
  Ability,
  AbilityClass,
  InferSubjects,
  ExtractSubjectType,
} from '@casl/ability';
import { Roles, Users } from 'src/users/schemas/users.schema';
import { Series } from 'src/series/schemas/series.schema';

export enum Action {
  Manage = 'manage',
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

type Subjects = InferSubjects<typeof Users | typeof Series> | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: User) {
    const { can, build } = new AbilityBuilder<Ability<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>,
    );

    switch (user.role) {
      case Roles.Administrator:
        // read-write access to everything
        can(Action.Manage, 'all');
        break;
      case Roles.Manager:
        can(Action.Create, 'all');
        can(Action.Update, 'all');
        can(Action.Read, 'all');
        break;
      case Roles.Author:
        can(Action.Read, 'all');
        break;
      case Roles.Viewer:
        can(Action.Read, 'all');
        break;
      default:
        break;
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
