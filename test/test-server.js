const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, closeServer, runServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('Blog Posts', function(){
    before(function(){
        return runServer();
    });
    after(function(){
        return closeServer();
    });

    it('should list blog posts on GET', function(){
        return chai.request(app)
            .get('/blog-posts')
            .then(function(res){
                expect(res).to.have.status(200);
                expect(res).to.be.json;
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.be.at.least(1);
                const expectedKeys = [
                    'id',
                    'title',
                    'content',
                    'author',
                    'publishDate'
                ];
                res.body.forEach(function(item){
                    expect(item).to.be.a('object');
                    expect(item).to.include.keys(expectedKeys);
                });
            });
    });
});

it('should add a blog post on POST', function(){
    const newPost = {
        title: 'Lorem ipsum',
        content: 'dolor sit amet',
        author: 'consectetur adipiscing elit'
    };
    const expectedKeys = [
        'id',
        'title',
        'content',
        'author',
        'publishDate'
    ];
    return chai.request(app)
        .post('/blog-posts')
        .send(newPost)
        .then(function(res){
            expect(res).to.have.status(201);
            expect(res).to.be.json;
            expect(res.body).to.be.a('object');
            expect(res.body).to.include.keys(expectedKeys);
            expect(res.body.title).to.equal(newPost.title);
            expect(res.body.content).to.equal(newPost.content);
            expect(res.body.author).to.equal(newPost.author);
        });
});

it('should error if POST is missing expected values', function(){
    badRequestData = {};
    return chai.request(app)
        .post('/blog-posts')
        .send(badRequestData)
        .then(function(res){
            expect(res).to.have.status(400);
        });
});

it('should update blog posts on PUT', function(){
    return (
        chai.request(app)
            .get('/blog-posts')
            .then(function(res){
                const updatedPost = Object.assign(res.body[0],{
                    title: 'Lorem ipsum dolor',
                    content: 'dolor sit amet',
                });
                return chai.request(app)
                    .put(`/blog-posts/${res.body[0].id}`)
                    .send(updatedPost)
                    .then(function(res){
                        expect(res).to.have.status(204);
                    });
            })
    );
});

it('should delete blog posts on DELETE', function(){
    return chai.request(app)
        .get('/blog-posts')
        .then(function(res){
            return chai.request(app)
                .delete(`/blog-posts/${res.body[0].id}`);
        })
        .then(function(res){
            expect(res).to.have.status(204);
        });
});