import chai from 'chai';
import chaiHttp = require('chai-http');
const expect = chai.expect;

chai.use(chaiHttp);

const baseURL = 'http://localhost:3000';
const users = '/users';

async function removeUsers() {
  const response = await chai.request(baseURL).get(users);
  const usersToBeDeleted = response.body;
  for (let i = 0; i < usersToBeDeleted.length; i++) {
    await chai.request(baseURL).del(`${users}/${usersToBeDeleted[i].id}`);
  }
}

describe('users controller tests', () => {
  beforeAll(async () => {
    await removeUsers();
  });
  afterEach(async () => {
    await removeUsers();
  });
  describe('POST /users scenarios', () => {
    it('should create user', async () => {
      chai
        .request(baseURL)
        .post(users)
        .send({
          firstName: 'firstName',
          lastName: 'lastname',
          userName: 'username',
          password: 'password',
        })
        .end((err, res) => {
          const id = res.body.id;
          expect(res).to.have.status(201);
          expect(res).to.be.json;
          expect(res.body).to.deep.equal({
            firstName: 'firstName',
            lastName: 'lastname',
            userName: 'username',
            id,
          });
        });
    });

    it('should return error if firstName is not provided', async () => {
      chai
        .request(baseURL)
        .post(users)
        .send({
          lastName: 'lastName',
          userName: 'userName',
          password: 'password',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.deep.equal({
            error: 'Bad Request',
            message: [
              'firstName must be a string',
              'firstName should not be empty',
            ],
            statusCode: 400,
          });
        });
    });

    it('should return error if firstName is empty string', async () => {
      chai
        .request(baseURL)
        .post(users)
        .send({
          firstName: '',
          lastName: 'lastName',
          userName: 'userName',
          password: 'password',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.deep.equal({
            error: 'Bad Request',
            message: ['firstName should not be empty'],
            statusCode: 400,
          });
        });
    });

    it('should return error if firstName is not string', async () => {
      chai
        .request(baseURL)
        .post(users)
        .send({
          firstName: 123,
          lastName: 'lastName',
          userName: 'userName',
          password: 'password',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.deep.equal({
            error: 'Bad Request',
            message: ['firstName must be a string'],
            statusCode: 400,
          });
        });
    });

    it('should return error if lastName is not provided', async () => {
      chai
        .request(baseURL)
        .post(users)
        .send({
          firstName: 'firstName',
          userName: 'userName',
          password: 'password',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.deep.equal({
            error: 'Bad Request',
            message: [
              'lastName must be a string',
              'lastName should not be empty',
            ],
            statusCode: 400,
          });
        });
    });

    it('should return error if lastName is empty string', async () => {
      chai
        .request(baseURL)
        .post(users)
        .send({
          firstName: 'firstName',
          lastName: '',
          userName: 'userName',
          password: 'password',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.deep.equal({
            error: 'Bad Request',
            message: ['lastName should not be empty'],
            statusCode: 400,
          });
        });
    });

    it('should return error if lastName is not string', async () => {
      chai
        .request(baseURL)
        .post(users)
        .send({
          firstName: 'firstName',
          lastName: 123,
          userName: 'userName',
          password: 'password',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.deep.equal({
            error: 'Bad Request',
            message: ['lastName must be a string'],
            statusCode: 400,
          });
        });
    });

    it('should return error if username is not provided', async () => {
      chai
        .request(baseURL)
        .post(users)
        .send({
          firstName: 'firstName',
          lastName: 'lastName',
          password: 'password',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.deep.equal({
            error: 'Bad Request',
            message: [
              'userName must be a string',
              'userName should not be empty',
            ],
            statusCode: 400,
          });
        });
    });

    it('should return error if username is empty string', async () => {
      chai
        .request(baseURL)
        .post(users)
        .send({
          firstName: 'firstName',
          lastName: 'lastName',
          userName: '',
          password: 'password',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.deep.equal({
            error: 'Bad Request',
            message: ['userName should not be empty'],
            statusCode: 400,
          });
        });
    });

    it('should return error if username is not string', async () => {
      chai
        .request(baseURL)
        .post(users)
        .send({
          firstName: 'firstName',
          lastName: 'lastName',
          userName: 123,
          password: 'password',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.deep.equal({
            error: 'Bad Request',
            message: ['userName must be a string'],
            statusCode: 400,
          });
        });
    });

    it('should return error if username is not unique', async () => {
      // create a user
      const userName = 'userName';
      let response = await chai.request(baseURL).post(users).send({
        firstName: 'firstName',
        lastName: 'lastName',
        userName,
        password: 'password',
      });

      expect(response).to.have.status(201);

      response = await chai.request(baseURL).post(users).send({
        firstName: 'firstName',
        lastName: 'lastName',
        userName,
        password: 'password',
      });
      expect(response).to.have.status(400);
      expect(response.body).to.deep.equal({
        message: `User with username 'userName' already exist`,
        statusCode: 400,
      });
    });

    it('should return error if password is not provided', async () => {
      chai
        .request(baseURL)
        .post(users)
        .send({
          firstName: 'firstName',
          lastName: 'lastName',
          userName: 'userName',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.deep.equal({
            error: 'Bad Request',
            message: [
              'password must be a string',
              'password should not be empty',
            ],
            statusCode: 400,
          });
        });
    });

    it('should return error if password is empty string', async () => {
      chai
        .request(baseURL)
        .post(users)
        .send({
          firstName: 'firstName',
          lastName: 'lastName',
          userName: 'userName',
          password: '',
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.deep.equal({
            error: 'Bad Request',
            message: ['password should not be empty'],
            statusCode: 400,
          });
        });
    });

    it('should return error if password is not string', async () => {
      chai
        .request(baseURL)
        .post(users)
        .send({
          firstName: 'firstName',
          lastName: 'lastName',
          userName: 'userName',
          password: 123,
        })
        .end((err, res) => {
          expect(res).to.have.status(400);
          expect(res.body).to.deep.equal({
            error: 'Bad Request',
            message: ['password must be a string'],
            statusCode: 400,
          });
        });
    });
  });

  describe('GET /users scenarios', () => {
    it('should get users', async () => {
      // create three users
      let response = await chai.request(baseURL).post(users).send({
        firstName: 'firstName1',
        lastName: 'lastName1',
        userName: 'userName1',
        password: 'password',
      });

      expect(response).to.have.status(201);
      const id1 = response.body.id;

      response = await chai.request(baseURL).post(users).send({
        firstName: 'firstName2',
        lastName: 'lastName2',
        userName: 'userName2',
        password: 'password',
      });

      expect(response).to.have.status(201);
      const id2 = response.body.id;

      response = await chai.request(baseURL).post(users).send({
        firstName: 'firstName3',
        lastName: 'lastName3',
        userName: 'userName3',
        password: 'password',
      });

      expect(response).to.have.status(201);
      const id3 = response.body.id;

      response = await chai.request(baseURL).get(users);
      expect(response).to.have.status(200);
      expect(response.body.length).to.equal(3);
      expect(response.body).to.deep.equal([
        {
          firstName: 'firstName1',
          lastName: 'lastName1',
          userName: 'userName1',
          id: id1,
        },
        {
          firstName: 'firstName2',
          lastName: 'lastName2',
          userName: 'userName2',
          id: id2,
        },
        {
          firstName: 'firstName3',
          lastName: 'lastName3',
          userName: 'userName3',
          id: id3,
        },
      ]);
    });
  });

  describe('GET /users/:id scenarios', () => {
    it('should return user', async () => {
      // create one user
      let response = await chai.request(baseURL).post(users).send({
        firstName: 'firstName',
        lastName: 'lastName',
        userName: 'userName',
        password: 'password',
      });

      expect(response).to.have.status(201);

      const userId = response.body.id;

      response = await chai.request(baseURL).get(`${users}/${userId}`);

      expect(response).to.have.status(200);
      expect(response.body).to.deep.equal({
        firstName: 'firstName',
        lastName: 'lastName',
        userName: 'userName',
        id: userId,
      });
    });

    it('should return error if id is invalid', async () => {
      const response = await chai.request(baseURL).get(`${users}/invalid`);
      expect(response).to.have.status(400);
      expect(response.body).to.deep.equal({
        message: 'User id : invalid is invalid',
        statusCode: 400,
      });
    });

    it('should return error if user is not found', async () => {
      const response = await chai
        .request(baseURL)
        .get(`${users}/6309ac729388e080da908875`);

      expect(response).to.have.status(404);
      expect(response.body).to.deep.equal({
        message: 'Not Found',
        statusCode: 404,
      });
    });
  });

  describe('PATCH /users/:id scenarios', () => {
    it('should update firstName', async () => {
      // create one user
      let response = await chai.request(baseURL).post(users).send({
        firstName: 'firstName',
        lastName: 'lastName',
        userName: 'userName',
        password: 'password',
      });

      expect(response).to.have.status(201);
      expect(response.body.firstName).to.equal('firstName');
      const userId = response.body.id;

      response = await chai.request(baseURL).patch(`${users}/${userId}`).send({
        firstName: 'firstNameUpdated',
      });

      expect(response).to.have.status(200);
      expect(response.body).to.deep.equal({
        firstName: 'firstNameUpdated',
        lastName: 'lastName',
        userName: 'userName',
        id: userId,
      });
    });

    it('should return error if firstName is empty string', async () => {
      let response = await chai.request(baseURL).post(users).send({
        firstName: 'firstName',
        lastName: 'lastName',
        userName: 'userName',
        password: 'password',
      });

      expect(response).to.have.status(201);
      expect(response.body.firstName).to.equal('firstName');
      const userId = response.body.id;

      response = await chai.request(baseURL).patch(`${users}/${userId}`).send({
        firstName: 123,
        lastName: 'lastNameUpdated',
      });

      expect(response).to.have.status(400);
      expect(response.body).to.deep.equal({
        error: 'Bad Request',
        message: ['firstName must be a string'],
        statusCode: 400,
      });

      response = await chai.request(baseURL).get(`${users}/${userId}`);

      expect(response).to.have.status(200);
      expect(response.body).to.deep.equal({
        firstName: 'firstName',
        lastName: 'lastName',
        userName: 'userName',
        id: userId,
      });
    });

    it('should return error if firstName is not string', async () => {
      let response = await chai.request(baseURL).post(users).send({
        firstName: 'firstName',
        lastName: 'lastName',
        userName: 'userName',
        password: 'password',
      });

      expect(response).to.have.status(201);
      expect(response.body.firstName).to.equal('firstName');
      const userId = response.body.id;

      response = await chai.request(baseURL).patch(`${users}/${userId}`).send({
        firstName: '',
        lastName: 'lastNameUpdated',
      });

      expect(response).to.have.status(400);
      expect(response.body).to.deep.equal({
        error: 'Bad Request',
        message: ['firstName should not be empty'],
        statusCode: 400,
      });

      response = await chai.request(baseURL).get(`${users}/${userId}`);

      expect(response).to.have.status(200);
      expect(response.body).to.deep.equal({
        firstName: 'firstName',
        lastName: 'lastName',
        userName: 'userName',
        id: userId,
      });
    });

    it('should update lastName', async () => {
      // create one user
      let response = await chai.request(baseURL).post(users).send({
        firstName: 'firstName',
        lastName: 'lastName',
        userName: 'userName',
        password: 'password',
      });

      expect(response).to.have.status(201);
      expect(response.body.lastName).to.equal('lastName');
      const userId = response.body.id;

      response = await chai.request(baseURL).patch(`${users}/${userId}`).send({
        lastName: 'lastNameUpdated',
      });

      expect(response).to.have.status(200);
      expect(response.body).to.deep.equal({
        firstName: 'firstName',
        lastName: 'lastNameUpdated',
        userName: 'userName',
        id: userId,
      });
    });

    it('should return error if lastName is empty string', async () => {
      let response = await chai.request(baseURL).post(users).send({
        firstName: 'firstName',
        lastName: 'lastName',
        userName: 'userName',
        password: 'password',
      });

      expect(response).to.have.status(201);
      const userId = response.body.id;

      response = await chai.request(baseURL).patch(`${users}/${userId}`).send({
        firstName: 'firstNameUpdated',
        lastName: '',
      });

      expect(response).to.have.status(400);
      expect(response.body).to.deep.equal({
        error: 'Bad Request',
        message: ['lastName should not be empty'],
        statusCode: 400,
      });

      response = await chai.request(baseURL).get(`${users}/${userId}`);

      expect(response).to.have.status(200);
      expect(response.body).to.deep.equal({
        firstName: 'firstName',
        lastName: 'lastName',
        userName: 'userName',
        id: userId,
      });
    });

    it('should return error if lastName is not string', async () => {
      let response = await chai.request(baseURL).post(users).send({
        firstName: 'firstName',
        lastName: 'lastName',
        userName: 'userName',
        password: 'password',
      });

      expect(response).to.have.status(201);
      const userId = response.body.id;

      response = await chai.request(baseURL).patch(`${users}/${userId}`).send({
        firstName: 'firstNameUpdated',
        lastName: 123,
      });

      expect(response).to.have.status(400);
      expect(response.body).to.deep.equal({
        error: 'Bad Request',
        message: ['lastName must be a string'],
        statusCode: 400,
      });

      response = await chai.request(baseURL).get(`${users}/${userId}`);

      expect(response).to.have.status(200);
      expect(response.body).to.deep.equal({
        firstName: 'firstName',
        lastName: 'lastName',
        userName: 'userName',
        id: userId,
      });
    });

    it('should update password', async () => {
      let response = await chai.request(baseURL).post(users).send({
        firstName: 'firstName',
        lastName: 'lastName',
        userName: 'userName',
        password: 'password',
      });

      expect(response).to.have.status(201);
      const userId = response.body.id;

      response = await chai.request(baseURL).patch(`${users}/${userId}`).send({
        password: 'passwordUpdated',
      });

      expect(response).to.have.status(200);
    });

    it('should return error if password is empty string', async () => {
      let response = await chai.request(baseURL).post(users).send({
        firstName: 'firstName',
        lastName: 'lastName',
        userName: 'userName',
        password: 'password',
      });

      expect(response).to.have.status(201);
      const userId = response.body.id;

      response = await chai.request(baseURL).patch(`${users}/${userId}`).send({
        firstName: 'firstNameUpdated',
        password: '',
      });

      expect(response).to.have.status(400);
      expect(response.body).to.deep.equal({
        error: 'Bad Request',
        message: ['password should not be empty'],
        statusCode: 400,
      });

      response = await chai.request(baseURL).get(`${users}/${userId}`);
      expect(response).to.have.status(200);
      expect(response.body).to.deep.equal({
        firstName: 'firstName',
        lastName: 'lastName',
        userName: 'userName',
        id: userId,
      });
    });

    it('should return error if password is not string', async () => {
      let response = await chai.request(baseURL).post(users).send({
        firstName: 'firstName',
        lastName: 'lastName',
        userName: 'userName',
        password: 'password',
      });

      expect(response).to.have.status(201);
      const userId = response.body.id;

      response = await chai.request(baseURL).patch(`${users}/${userId}`).send({
        firstName: 'firstNameUpdated',
        password: 123,
      });

      expect(response).to.have.status(400);
      expect(response.body).to.deep.equal({
        error: 'Bad Request',
        message: ['password must be a string'],
        statusCode: 400,
      });

      response = await chai.request(baseURL).get(`${users}/${userId}`);
      expect(response).to.have.status(200);
      expect(response.body).to.deep.equal({
        firstName: 'firstName',
        lastName: 'lastName',
        userName: 'userName',
        id: userId,
      });
    });

    it('should not update userName', async () => {
      let response = await chai.request(baseURL).post(users).send({
        firstName: 'firstName',
        lastName: 'lastName',
        userName: 'userName',
        password: 'password',
      });

      expect(response).to.have.status(201);
      expect(response.body.userName).to.equal('userName');
      const userId = response.body.id;

      response = await chai.request(baseURL).patch(`${users}/${userId}`).send({
        firstName: 'firstNameUpdated',
        userName: 'userNameUpdated',
      });

      expect(response).to.have.status(400);

      expect(response.body).to.deep.equal({
        error: 'Bad Request',
        message: ['property userName should not exist'],
        statusCode: 400,
      });

      response = await chai.request(baseURL).get(`${users}/${userId}`);

      expect(response).to.have.status(200);
      expect(response.body).to.deep.equal({
        firstName: 'firstName',
        lastName: 'lastName',
        userName: 'userName',
        id: userId,
      });
    });
  });

  describe('DEL /users/:id scenarios', () => {
    it('should delete user', async () => {
      let response = await chai.request(baseURL).post(users).send({
        firstName: 'firstName',
        lastName: 'lastName',
        userName: 'userName',
        password: 'password',
      });

      expect(response).to.have.status(201);
      const userId = response.body.id;

      response = await chai.request(baseURL).delete(`${users}/${userId}`);

      expect(response).to.have.status(204);

      response = await chai.request(baseURL).get(`${users}/${userId}`);

      expect(response).to.have.status(404);
      expect(response.body).to.deep.equal({
        message: 'Not Found',
        statusCode: 404,
      });
    });

    it('should return error if id is invalid', async () => {
      const response = await chai.request(baseURL).delete(`${users}/invalid`);

      expect(response).to.have.status(400);
      expect(response.body).to.deep.equal({
        message: 'User id : invalid is invalid',
        statusCode: 400,
      });
    });

    it('should return error if user is not found', async () => {
      const response = await chai
        .request(baseURL)
        .delete(`${users}/6309ac729388e080da908875`);

      expect(response).to.have.status(404);
      expect(response.body).to.deep.equal({
        message: 'Not Found',
        statusCode: 404,
      });
    });
  });
});
