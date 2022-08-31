import { UsersDocument } from '../schemas/users.schema';

export class User {
  /**
   * Id of the User
   * @example 62ed1c0022738d3d35b23712
   */
  readonly id: string;

  /**
   * Username of the User
   * @example jsmith
   */
  readonly userName: string;

  /**
   * First name of the User
   * @example John
   */
  readonly firstName: string;

  /**
   * Last name of the User
   * @example Smith
   */
  readonly lastName: string;

  constructor(user: UsersDocument) {
    this.id = user._id;
    this.userName = user.userName;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
  }
}
