const mongoose = require('mongoose');
const chai = require('chai');
const expect = chai.expect;
const User = require('./models/user');
const Post = require('./models/post');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/test');

describe('testing posts', () => {
  it('should fetch an array of posts', () => {
    return Post.find({}).then((posts) => {
      expect(posts).to.be.an('array');
    })
  });
  it('should add a post', () => {
    var newPost = Post({
      title: "new post",
      summary: "the post content",
      subreddit: "orange juice",
    });
    return newPost.save().then((post) => {
      expect(post).to.have.property('title');
    });
  });
  it('should return a post with valid properties', () => {
    return Post.find({}).then((posts) => {
      expect(posts[0].title).to.be.a('string');
      expect(posts[0].summary).to.be.a('string');
      expect(posts[0].subreddit).to.be.a('string');
    })
  })
  it('should remove a post', () => {
    return Post.find({ title: "new post" }).remove().then(() => {
      return Post.find({ title: "new post"}).then((post) => {
        expect(post.length).to.equal(0);
      })
    })
  });
});

describe('testing users', () => {
  it('should fetch an array of users', () => {
    return User.find({}).then((users) => {
      expect(users).to.be.an('array');
    })
  });
  it('should add a user', () => {
    var newUser = User({
      username: "testUser",
      password: "qwerty123"
    });
    return newUser.save().then((user) => {
      expect(newUser.username).to.be.a('string');
    })
  });
  it('should return a user with valid properties', () => {
    return User.find({}).then((users) => {
      expect(users[0]).to.have.property('username');
      expect(users[0]).to.have.property('password');
      expect(users[0]).to.have.property('createdAt');
      expect(users[0]).to.have.property('updatedAt');
    })
  })
  it('should remove a user', () => {
    return User.find({ username: "test user" }).remove().then(() => {
      return User.find({ username: "test user"}).then((user) => {
        expect(user.length).to.equal(0);
      })
    })
  });
});


// note: you don't need to call done if you return a promise!
