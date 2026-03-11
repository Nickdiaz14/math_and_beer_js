const supertest = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../app');
const Record = require('../models/Record');

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
    await Record.deleteMany({});
});

describe('Records API', () => {
    it('PUT - should create or update a new record', async () => {
        const recordData = {
            username: 'testuser',
            game: 'T04',
            record: 100,
            string_record: '1:00'
        };

        const response_1 = await supertest(app)
            .put('/api/record')
            .send(recordData)
            .expect(200);

        expect(response_1.body).toHaveProperty('_id');
        expect(response_1.body.username).toBe(recordData.username);
        expect(response_1.body.game).toBe(recordData.game);
        expect(response_1.body.record).toBe(recordData.record);
        expect(response_1.body.string_record).toBe(recordData.string_record);

        const recordInDb_1 = await Record.findOne({ username: recordData.username, game: recordData.game });
        expect(recordInDb_1).not.toBeNull();

        const recordDataUpdate = {
            username: 'testuser',
            game: 'T04',
            record: 99,
            string_record: '0:99'
        };

        const response_2 = await supertest(app)
            .put('/api/record')
            .send(recordDataUpdate)
            .expect(200);

        expect(response_2.body.record).toHaveProperty('_id');
        expect(response_2.body.record.username).toBe(recordDataUpdate.username);
        expect(response_2.body.record.game).toBe(recordDataUpdate.game);
        expect(response_2.body.record.record).toBe(recordDataUpdate.record);
        expect(response_2.body.record.string_record).toBe(recordDataUpdate.string_record);

        const recordInDb_2 = await Record.findOne({ username: recordDataUpdate.username, game: recordDataUpdate.game });
        expect(recordInDb_2).not.toBeNull();

        const recordDataWorst = {
            username: 'testuser',
            game: 'T04',
            record: 100,
            string_record: '1:00'
        };

        const response_3 = await supertest(app)
            .put('/api/record')
            .send(recordDataWorst)
            .expect(200);

        expect(response_3.body.record).toHaveProperty('_id');
        expect(response_3.body.record.username).toBe(recordDataUpdate.username);
        expect(response_3.body.record.game).toBe(recordDataUpdate.game);
        expect(response_3.body.record.record).toBe(recordDataUpdate.record);
        expect(response_3.body.record.string_record).toBe(recordDataUpdate.string_record);

        const recordInDb_3 = await Record.findOne({ username: recordDataWorst.username, game: recordDataWorst.game });
        expect(recordInDb_3).not.toBeNull();
    });

    it('GET - should get leaderboard of one game', async () => {
        const records = [
            {
                username: 'testuser',
                game: 'T04',
                record: 99,
                string_record: '0:99'
            },
            {
                username: 'testuser1',
                game: 'T04',
                record: 120,
                string_record: '1:20'
            },
            {
                username: 'testuser',
                game: 'T05',
                record: 150,
                string_record: '1:50'
            },
            {
                username: 'testuser1',
                game: 'T05',
                record: 200,
                string_record: '2:00'
            }
        ];
        for (const record of records) {
            await supertest(app)
                .put('/api/record')
                .send(record)
                .expect(200);
        }

        const response = await supertest(app)
            .get('/api/leaderboard/T04')

        expect(response.body[0].username).toBe(records[0].username);
        expect(response.body[1].username).toBe(records[1].username);
        expect(response.body.length).toBe(2);
    });

    it('GET - should get leaderboards', async () => {
        const records = [
            {
                username: 'testuser',
                game: 'T04',
                record: 99,
                string_record: '0:99'
            },
            {
                username: 'testuser1',
                game: 'T04',
                record: 120,
                string_record: '1:20'
            },
            {
                username: 'testuser',
                game: 'T05',
                record: 150,
                string_record: '1:50'
            },
            {
                username: 'testuser1',
                game: 'T05',
                record: 200,
                string_record: '2:00'
            }
        ];
        for (const record of records) {
            await supertest(app)
                .put('/api/record')
                .send(record)
                .expect(200);
        }

        const response = await supertest(app)
            .get('/api/leaderboards')

        expect(response.body.length).toBe(2);
        expect(response.body[0].leaderboard.length).toBe(2);
    });
});