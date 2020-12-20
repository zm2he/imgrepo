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

###  Upload an image from Postman
In Postman, create a new post request to the route /images/upload. Set up the body to be form-data; and then add ‘upload’ as a key. Change the type from text to file and choose an image to upload.

### References
Multer (https://www.npmjs.com/package/multer) - a node.js middleware for handling multipart/form-data
Uploading images to your node.js backend (https://medium.com/swlh/uploading-images-to-your-node-js-backend-978261eb0724)