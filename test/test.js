const express = require('express');
const app = express();
const request = require('supertest');
const describe = require('mocha').describe;
const assert = require('assert');

const mjolnir = require('../mjolnir');
app.use('/api', mjolnir());

const emailTest = 'test@test.com'
const passwordTest = '-'

describe('Post user ', function() {
  describe('POST /api/users', function() {
    it('respond with error', function(done) {
      request(app).post('/api/users')
      .send({
        firstname : 'Carlos',
        lastname : 'Cordoba',
        email:  emailTest,
        username : 'carloscba',
        password : passwordTest,
        gender : 'm'
      })
      .set('Accept', 'application/json').expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        if(res.body.user.id){
          return done();
        }else{
          return done(new Error('user id not found'))
        }
      });
    });
  });

  describe('POST /api/users', function() {
    it('Respond with error', function(done) {
      request(app).post('/api/users')
      .send({})
      .set('Accept', 'application/json').expect(500)
      .end(function(err, res) {
        if (err) return done(err);
        if(res.body.error){
          return done();
        }else{
          return done(new Error('Token not found'))
        }
      });
    });
  });
  
})

describe('Auth verify & signin', function() {
  describe('POST /auth/verify', function() {
    it('respond with json', function(done) {
      request(app).post('/api/auth/verify')
      .send({
        email: emailTest
      })
      .set('Accept', 'application/json').expect(200)
      .end(function(err, res) {
        if (err) return done(err);
        if(res.body.user.email === emailTest){
          return done();
        }else{
          return done(new Error('Email diferente'))
        }
      });
    });
  });

  describe('POST /auth/signin', function() {
    it('Respond with json', function(done) {
      request(app).post('/api/auth/signin')
      .send({
        email: emailTest,
        password : passwordTest
      })
      .set('Accept', 'application/json').expect(200)
      .end(function(err, res) {
        if (err){
          console.log('Error: ', res.body)
          return done(err);
        } 
        if(res.body.token){
          return done();
        }else{
          return done(new Error('Token not found'))
        }
      });
    });
  });
})