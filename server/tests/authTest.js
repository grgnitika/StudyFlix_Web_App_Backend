// const chai = require('chai');
// const User = require('../models/User');
// const chaiHttp = require('chai-http');
// const { expect } = chai;
// require('dotenv').config();

// chai.use(chaiHttp);

// const BASE_URL = 'http://localhost:5000';
// let validToken = ''; // Will store the valid JWT token after successful login

// describe('Auth API Tests', () => {

//   it('should register a new user successfully', (done) => {
//     chai.request(BASE_URL)
//       .post('/auth/register')
//       .send({
//         userName: 'Subiii',
//         userEmail: 'subiii@gmail.com',
//         password: 'pass123',
//         role: 'user',
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(201);
//         expect(res.body).to.have.property('message', "User registered successfully!");
//         done();
//       });
//   });

//   it('should not register a user with missing fields', (done) => {
//     chai.request(BASE_URL)
//       .post('/auth/register')
//       .send({
//         userName: 'testuser'
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(400);
//         expect(res.body).to.have.property('message', 'All fields are required');
//         done();
//       });
//   });

//   it('should not register a user with an existing email', (done) => {
//     chai.request(BASE_URL)
//       .post('/auth/register')
//       .send({
//         userName: 'newuser',
//         userEmail: 'testuser@gmail.com', // already used email
//         password: 'password123',
//         role: 'user'
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(400);
//         expect(res.body).to.have.property('message', 'User name or user email already exists');
//         done();
//       });
//   });

//   it('should not register a user with invalid email format', (done) => {
//     chai.request(BASE_URL)
//       .post('/auth/register')
//       .send({
//         userName: 'testuser',
//         userEmail: 'invalid-email',
//         password: 'password123',
//         role: 'user'
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(400);
//         expect(res.body).to.have.property('message', 'Invalid email format');
//         done();
//       });
//   });

//   it('should not register a user with an invalid role', (done) => {
//     chai.request(BASE_URL)
//       .post('/auth/register')
//       .send({
//         userName: 'testuser',
//         userEmail: 'testuser2@gmail.com',
//         password: 'password123',
//         role: 'invalidRole'
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(400);
//         expect(res.body).to.have.property('message', 'Invalid role');
//         done();
//       });
//   });

//   it('should log in a user successfully', (done) => {
//     chai.request(BASE_URL)
//       .post('/auth/login')
//       .send({
//         userEmail: 'testuser@gmail.com',
//         password: 'password123'
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body).to.have.property('data').that.has.property('accessToken');
//         validToken = res.body.data.accessToken; // Store the valid token for subsequent requests
//         done();
//       });
//   });

//   it('should not log in with an incorrect password', (done) => {
//     chai.request(BASE_URL)
//       .post('/auth/login')
//       .send({
//         userEmail: 'testuser@gmail.com',
//         password: 'wrongpassword'
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(401);
//         expect(res.body).to.have.property('message', 'Invalid email or password');
//         done();
//       });
//   });

//   it('should not log in with an unregistered email', (done) => {
//     chai.request(BASE_URL)
//       .post('/auth/login')
//       .send({
//         userEmail: 'nonexistentuser@gmail.com',
//         password: 'password123'
//       })
//       .end((err, res) => {
//         expect(res).to.have.status(401);
//         expect(res.body).to.have.property('message', 'Invalid email or password');
//         done();
//       });
//   });

//   it('should check if the user is authenticated', (done) => {
//     chai.request(BASE_URL)
//       .get('/auth/check-auth')
//       .set('Authorization', `Bearer ${validToken}`) // Corrected Authorization header format
//       .end((err, res) => {
//         expect(res).to.have.status(200);
//         expect(res.body).to.have.property('message', 'Authenticated user!');
//         done();
//       });
//   });

//   it('should not access authenticated route without token', (done) => {
//     chai.request(BASE_URL)
//       .get('/auth/check-auth')
//       .end((err, res) => {
//         expect(res).to.have.status(401);
//         expect(res.body).to.have.property('message', 'User is not authenticated (Token missing or incorrect format)');
//         done();
//       });
//   });

//   it('should not access authenticated route with invalid token', (done) => {
//     chai.request(BASE_URL)
//       .get('/auth/check-auth')
//       .set('Authorization', 'Bearer invalidtoken')
//       .end((err, res) => {
//         expect(res).to.have.status(401);
//         expect(res.body).to.have.property('message', 'Invalid or expired token');
//         done();
//       });
//   });
// });
