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
```
GET /images

POST /images  - upload images as form-data
Response example:
[
    {
        "id": "RJAQIiompB",
        "name": "13226983_877277119069903_2754639697391931078_n.jpg",
        "url": "http://localhost:8080/images/RJAQIiompB"
    },
    {
        "id": "UT4W7nmfH",
        "name": "13179095_877277149069900_525441892896211067_n.jpg",
        "url": "http://localhost:8080/images/UT4W7nmfH"
    }
]

Response example: 
{
    "status": "success",
    "message": "images uploaded",
    "images": [
        {
            "id": "UT4W7nmfH",
            "name": "13179095_877277149069900_525441892896211067_n.jpg",
            "url": "http://localhost:8080/images/UT4W7nmfH"
        },
        {
            "id": "RJAQIiompB",
            "name": "13226983_877277119069903_2754639697391931078_n.jpg",
            "url": "http://localhost:8080/images/RJAQIiompB"
        }
    ]
}

POST /images/:name  - upload image as binary
Response example: {
    "status": "success",
    "message": "images uploaded",
    "id": "UT4W7nmfH",
    "name": "13179095_877277149069900_525441892896211067_n.jpg",
    "url": "http://localhost:8080/images/UT4W7nmfH"
}

GET /images/:id - download an image
GET /images/:id?type=thumbnail - download an image's thumbnail

DELETE /images/:id
```
<br><br>

## Configurations
All images are saved in sub-folder /images<br>
By default the server listens on port number 8080, or whatever specified in environment variable IMGREPO_PORT<br>
By default the server allows image size up to 10 mega bytes, or the value specified in environment variable: IMGREPO_MAX_IMG_SIZE<br>
<br><br>

## Data folder
The project utilizes local disk folder for saving data which include<br>
```
Signed user files:  user-id.json
Uploaded image files: img-id-orignalfilename
Thumbnial image files: thumbnail-id.filextension
```

It should be pretty straight forward to migrate disk-folder implementation to database if needed<br><br>

## Id
A user id is just a signed user's email (which is unique)<br>
An image id is concatenating of hash(user.email) and a dynamically auto-generated short unique id.<br><br>

##  Upload images from Postman
### form-data type body
In Postman, create a new post request to the route /images; click on the "form-data", then add "images" as a key and you will see a hidden drop-down at the right of the key field which says Text as default,  change the type from text to file and choose one or multiple image files to upload.<br>
<br><img src="public/form-data.png?raw=true" /><br><br>
### binary type body
Binary is designed to send the information in a format that cannot be entered manually, to use this option, create a new post request to the route /images/:name (here name is the image file name);  click on the "binary", a "CHOOSE FILES" option will be available, click it to select an image file to upload.<br>
Please note image name must be specified in the route<br>
<br><img src="public/binary-data.png?raw=true" /><br><br>

## References
[1] How to upload files in Node.js and Express (https://attacomsian.com/blog/uploading-files-nodejs-express)<br>
[2] Express File Upload with Multer in Node.js (https://attacomsian.com/blog/express-file-upload-multer)<br>
[3] Generate an image thumbnail (https://github.com/onildoaguiar/image-thumbnail)<br>
[4] React file upload: proper and easy way, with NodeJS! (https://programmingwithmosh.com/javascript/react-file-upload-proper-server-side-nodejs-easy/) <br>
[5] How to upload files in React with NodeJS & Express (https://reactgo.com/react-file-upload/)<br>