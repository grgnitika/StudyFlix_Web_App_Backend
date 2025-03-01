const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = chai.expect;
const BASE_URL = 'http://localhost:5000'; 

chai.use(chaiHttp);

let instructorToken;
let courseId; // Variable to hold course ID

before((done) => {
  chai.request(BASE_URL)
    .post('/auth/login')
    .send({
      userEmail: 'admin1234@example.com',  
      password: 'admin1234',     
    })
    .end((err, res) => {
      expect(res).to.have.status(200);
      instructorToken = res.body.data.accessToken;  
      done();
    });
});

// Tests for Courses
describe('Course Tests', () => {
    it('should create a new course successfully', (done) => {
        chai.request(BASE_URL)
          .post('/instructor/course/add')  
          .set('Authorization', `Bearer ${instructorToken}`)
          .send({
            title: 'JavaScript Basics',
            description: 'A course for beginners.',
            category: 'Programming',
            level: 'Beginner',
            primaryLanguage: 'English',
            subtitle: 'English',
            image: 'image_url',  
            welcomeMessage: 'Welcome to JavaScript Basics',
            pricing: 100,
            objectives: 'Understand the basics of JavaScript',
            isPublished: true,
            curriculum: [
              {
                title: 'Introduction to JavaScript',
                videoUrl: 'video_url_1',
                public_id: 'public_id_1',
                freePreview: true,
              },
            ],
          })
          .end((err, res) => {
            expect(res).to.have.status(201);
            expect(res.body).to.have.property('message', "Course saved successfully");
            courseId = res.body.data._id;
            done();
          });
          
      });
    
  
    it('should not update course if course ID is invalid', (done) => {
        const invalidCourseId = '65d1c88c2fbc48f99e9d1234';
        chai
          .request(BASE_URL)
          .put(`/instructor/course/update/${invalidCourseId}`)
          .set('Authorization', `Bearer ${instructorToken}`)
          .send({
            title: 'Advanced JavaScript',
            description: 'A deep dive into JavaScript.',
            curriculum: [
              {
                title: 'Advanced JavaScript',
                videoUrl: 'video_url_2',
                public_id: 'public_id_3',
                freePreview: true,
              },
            ],
          })
          .end((err, res) => {
            expect(res).to.have.status(404); 
            expect(res.body).to.have.property('message', 'Course not found!');
            done();
          });
      });
    
    it('should update an existing course successfully', (done) => {
        chai
          .request(BASE_URL)
          .put(`/instructor/course/update/${courseId}`)
          .set('Authorization', `Bearer ${instructorToken}`)
          .send({
            title: 'Advanced JavaScript',
            description: 'A deep dive into JavaScript.',
            curriculum: [
              {
                title: 'Advanced JavaScript',
                videoUrl: 'video_url_2',
                public_id: 'public_id_2',
                freePreview: false,
              },
            ],
          })
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Course updated successfully');
            done();
          });
      });

    it('should fetch a course by its ID', (done) => {
        chai.request(BASE_URL)
          .get(`/instructor/course/get/details/${courseId}`)
          .set('Authorization', `Bearer ${instructorToken}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.data).to.have.property('_id', courseId);
            done();
          });
      });


    it("should fetch all courses successfully", (done) => {
        chai.request(BASE_URL)
        .get("/instructor/course/get") 
        .set("Authorization", `Bearer ${instructorToken}`) 
        .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property("data").to.be.an("array");
            done();
        });
    });

    it('should delete an existing course successfully', (done) => {
        if (!courseId) {
          return done(new Error('❌ Valid Course ID not found'));
        }
    
        chai
          .request(BASE_URL)
          .delete(`/instructor/course/delete/${courseId}`)
          .set('Authorization', `Bearer ${instructorToken}`)
          .end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body).to.have.property('message', 'Course deleted successfully');
            done();
          });
      });   
});

