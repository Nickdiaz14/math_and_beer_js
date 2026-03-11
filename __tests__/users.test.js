const supertest = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const User = require('../models/User');

jest.setTimeout(30000); // Increase timeout for MongoDB Memory Server startup
let mongoServer;

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, { dbName: 'test' });
});

afterAll(async () => {
    await mongoose.disconnect();
    if (mongoServer) await mongoServer.stop();
});

beforeEach(async () => {
    await User.deleteMany({});
});

describe('Users API', () => {
    it('POST - should create a new user', async () => {
        const userData = {
            username: 'testuser',
            UUID_id: 'abcd',
        };

        const response_1 = await supertest(app)
            .post('/api/create_user')
            .send(userData)
            .expect(200);

        expect(response_1.body).toHaveProperty('_id');
        expect(response_1.body.username).toBe(userData.username);
        expect(response_1.body.game).toBe(userData.game);
    });

    it('POST - should create a new user', async () => {
        const usersData = [
            {
                username: 'testuser',
                UUID_id: 'abcd',
            },
            {
                username: 'testuser_2',
                UUID_id: 'efgh',
            }
        ];

        for (const user of usersData) {
            await supertest(app)
                .post('/api/create_user')
                .send(user)
                .expect(200);
        }

        for (const user of usersData) {
            response_1 = await supertest(app)
                .get(`/api/get_user/${user.UUID_id}`)

            expect(response_1.body).toBe(user.username);
        }
    });
});