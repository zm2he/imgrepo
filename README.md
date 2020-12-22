# Node.js Express Image Repo Server

## Project setup
```
mkdir images
npm install
```

### Run
```
node server.js
```

### APIs
GET /images
POST /images/upload
GET /images/:id
DELETE /images/:id

### Configurations
All images are saved in sub-folder /images
By default the server listens on port number 8080, or whatever specified in environment variable IMGREPO_PORT
By default the server allows image size up to 10 mega bytes, or the value specified in environment variable: IMGREPO_MAX_IMG_SIZE

###  Upload images from Postman
In Postman, create a new post request to the route /images/upload. Set up the body to be form-data; and then add "images" as a key. Change the type from text to file and choose one or multiple image files to upload.

### References
[1] How to upload files in Node.js and Express (https://attacomsian.com/blog/uploading-files-nodejs-express)
[2] Express File Upload with Multer in Node.js (https://attacomsian.com/blog/express-file-upload-multer)
