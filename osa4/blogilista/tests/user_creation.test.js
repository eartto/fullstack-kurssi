const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const testHelper = require('../utils/test_helper')
const supertest = require('supertest')
const assert = require('node:assert')
const app = require('../app')

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})
})

const newUser = {
    username: 'bo',
    name: 'Bobby',
    password: '12343rfdgjk',
}

test('no weird user creation', async () => {
    await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
})

assert.strictEqual(testHelper.usersInDb.length, 0)

afterAll(async () => {
    await mongoose.connection.close()
})

