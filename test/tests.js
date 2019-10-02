var supertest   = require("supertest");
var should      = require("should");

var models = require('../models');

var server = supertest.agent("http://localhost:3000");


describe("Test Public Pages", () => {

    it("Test GET Public Home Page", (done) => {

        server
            .get("/")
            .expect(200)
            .end(( err, res) => {

                // HTTP status should be 200
                res.status.should.eql(200);
                // Error key should be false.
                //res.body.error.should.eql(false);

                done();
            });
    });

    it("Test GET Public Sign In Page", (done) => {

        server
            .get("/signin")
            .expect(200)
            .end(( err, res) => {

                // HTTP status should be 200
                res.status.should.eql(200);
                // Error key should be false.
                //res.body.error.should.eql(false);

                done();
            });
    });

    it("Test GET Public Sign Up Page", (done) => {

        server
            .get("/signup")
            .expect(200)
            .end(( err, res) => {

                // HTTP status should be 200
                res.status.should.eql(200);
                // Error key should be false.
                //res.body.error.should.eql(false);

                done();
            });
    });

    it("Test GET Public Restore Page", (done) => {

        server
            .get("/restore")
            .expect(200)
            .end(( err, res) => {

                // HTTP status should be 200
                res.status.should.eql(200);
                // Error key should be false.
                //res.body.error.should.eql(false);

                done();
            });
    });

});