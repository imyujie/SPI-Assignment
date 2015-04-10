// Generated by LiveScript 1.3.1
(function(){
  var express, fs, Assignment, Homework, path, router, mkdirsSync, isAuthenticated;
  express = require('express');
  fs = require('fs');
  Assignment = require('../models/assignment');
  Homework = require('../models/homework');
  path = require('path');
  router = express.Router();
  mkdirsSync = function(dirpath, mode, callback){
    if (fs.existsSync(dirpath)) {
      return true;
    } else {
      if (mkdirsSync(path.dirname(dirpath), mode)) {
        fs.mkdirSync(dirpath, mode);
        return true;
      }
    }
  };
  isAuthenticated = function(req, res, next){
    if (req.isAuthenticated()) {
      return next();
    } else {
      return res.redirect('/');
    }
  };
  module.exports = function(passport){
    router.get('/', function(req, res){
      res.render('login', {
        message: req.flash('message')
      });
    });
    router.post('/login', passport.authenticate('login', {
      successRedirect: '/home',
      failureRedirect: '/',
      failureFlash: true
    }));
    router.get('/signup', function(req, res){
      res.render('signup', {
        message: req.flash('message')
      });
    });
    router.post('/signup', passport.authenticate('signup', {
      successRedirect: '/assign',
      failureRedirect: '/signup',
      failureFlash: true
    }));
    router.get('/home', isAuthenticated, function(req, res){
      res.render('post', {
        user: req.user
      });
    });
    router.get('/signout', function(req, res){
      req.logout();
      res.redirect('/');
    });
    router.get('/assign', isAuthenticated, function(req, res){
      res.render('post');
    });
    router.post('/assign', isAuthenticated, function(req, res){
      var newAssignment;
      newAssignment = new Assignment({
        title: req.param('title'),
        deadline: req.param('deadline'),
        description: req.param('description'),
        teacherId: req.user._id,
        teacherName: req.user.name
      });
      newAssignment.save(function(err){
        if (err) {
          return handleError(err);
        }
        return Assignment.findById(newAssignment, function(err, doc){
          if (err) {
            return handleError(err);
          }
          console.log(doc);
        });
      });
    });
    router.get('/assignments', isAuthenticated, function(req, res){
      if (req.user.identity === 0) {
        Assignment.find(function(err, hwlist){
          if (err) {
            return handleError(err);
          }
          res.render('hwlist', {
            asmlist: hwlist
          });
        });
      } else {
        Assignment.find({
          'teacherId': req.user._id
        }, function(err, hwlist){
          if (err) {
            return handleError(err);
          }
          res.render('hwlist', {
            asmlist: hwlist
          });
        });
      }
    });
    router.get(/^\/assignments\/(.*)/, isAuthenticated, function(req, res){
      var assignmentId;
      assignmentId = req.params[0];
      Assignment.findById(assignmentId, function(err, doc){
        if (err) {
          return handleError(err);
        }
        res.render('detail', {
          assignment: doc,
          hwlist: [],
          user: req.user
        });
      });
    });
    router.post('/upload', isAuthenticated, function(req, res){
      var newHomework, obj, tmpPath, newPath;
      if (req.user.identity === 1) {
        console.log('Not Allow to Submit');
        return;
      }
      newHomework = new Homework({
        requirementId: req.param('assignment_id'),
        studentUsr: req.user.username,
        studentName: req.user.name
      });
      obj = req.files.homework;
      tmpPath = obj.path;
      newPath = './uploads/' + req.param('assignment_title');
      newPath += req.param('assignment_id') + '/';
      newPath += req.user.name + req.user.username + '/';
      console.log(newPath);
      mkdirsSync(newPath);
      newPath += obj.name;
      fs.rename(tmpPath, newPath, function(err){
        if (err) {
          throw err;
        }
      });
      newHomework.save(function(err){
        if (err) {
          return handleError(err);
        }
        return Homework.findById(newHomework, function(err, doc){
          if (err) {
            return handleError(err);
          }
          console.log(doc);
        });
      });
    });
    router.post('/modify', isAuthenticated, function(req, res){
      var assiId, dateStr, ddl;
      if (req.user.identity === 0) {
        console.log('Not Allow to Modify');
        return;
      }
      assiId = req.param('assignment_id');
      dateStr = req.param('deadline').replace('-', '/');
      ddl = new Date(dateStr);
      if (ddl < Date()) {
        res.send('Invalid Deadline');
      } else {
        Assignment.update({
          id: assId
        }, {
          $set: {
            deadline: ddlDate
          }
        }, function(err){});
      }
    });
    return router.post('/score', isAuthenticated, function(req, res){
      if (req.user.identity === 0) {
        console.log('Not Allow to Score');
        return;
      }
      Homework.update({
        id: req.params['id']
      }, {
        $set: {
          score: req.params['score']
        }
      }, function(err){});
    });
  };
}).call(this);
