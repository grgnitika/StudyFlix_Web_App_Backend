const chai = require('chai');
const chaiHttp = require('chai-http');
const fs = require('fs');
const path = require('path');
const expect = chai.expect;
const BASE_URL = 'http://localhost:5000'; 

chai.use(chaiHttp);

let instructorToken;
let publicId; 


before((done) => {
  chai
    .request(BASE_URL)
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

describe('Media Routes Tests', () => {
  // Test uploading a single file
  it('should upload a file successfully', (done) => {
    const filePath = path.join(__dirname, 'test-file.jpg'); 

    chai
      .request(BASE_URL)
      .post('/media/upload')
      .set('Authorization', `Bearer ${instructorToken}`)
      .attach('file', fs.readFileSync(filePath), 'test-file.jpg')
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('success', true);
        expect(res.body.data).to.have.property('public_id');
        publicId = res.body.data.public_id; 
        done();
      });
  });

  // Test uploading a file without a file
  it('should return an error if no file is provided', (done) => {
    chai
      .request(BASE_URL)
      .post('/media/upload')
      .set('Authorization', `Bearer ${instructorToken}`)
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body).to.have.property('success', false);
        expect(res.body).to.have.property('message', 'Error uploading file');
        done();
      });
  });

  // Test deleting a file
  it('should delete a file successfully', (done) => {
    chai
      .request(BASE_URL)
      .delete(`/media/delete/${publicId}`)
      .set('Authorization', `Bearer ${instructorToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('success', true);
        expect(res.body).to.have.property(
          'message',
          'Assest deleted successfully from cloudinary'
        );
        done();
      });
  });


  // Test bulk uploading files
  it('should upload multiple files successfully', (done) => {
    const file1Path = path.join(__dirname, 'test-file1.jpg'); 
    const file2Path = path.join(__dirname, 'test-file2.jpg'); 

    chai
      .request(BASE_URL)
      .post('/media/bulk-upload')
      .set('Authorization', `Bearer ${instructorToken}`)
      .attach('files', fs.readFileSync(file1Path), 'test-file1.jpg') 
      .attach('files', fs.readFileSync(file2Path), 'test-file2.jpg') 
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('success', true);
        expect(res.body.data).to.be.an('array').with.lengthOf(2);
        done();
      });
  });

  // Test fetching total number of course videos
  it('should fetch the total number of course videos', (done) => {
    chai
      .request(BASE_URL)
      .get('/media/total-videos')
      .set('Authorization', `Bearer ${instructorToken}`)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property('data');
        expect(res.body.data).to.be.a('number');
        done();
      });
  });
});