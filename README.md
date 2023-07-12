![Version](https://img.shields.io/badge/Version-0.7-blue.svg?cacheSeconds=2592000)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![runs with nodeJs](https://img.shields.io/badge/Runs%20with%20Node.Js-000.svg?style=flat-square&logo=nodedotjs&labelColor=f3f3f3&logoColor=#3C823B)](https://nodejs.org/ru)
[![runs with express](https://img.shields.io/badge/Runs%20with%20Express-000.svg?style=flat-square&logo=Express&labelColor=f3f3f3&logoColor=7D7D7D)](https://expressjs.com/ru/)
[![runs with nodemon](https://img.shields.io/badge/Runs%20with%20Nodemon-000.svg?style=flat-square&logo=nodemon&labelColor=f3f3f3&logoColor=nodemon)](https://www.npmjs.com/package/nodemon)
[![runs with jest](https://img.shields.io/badge/Runs%20with%20Jest-000.svg?style=flat-square&logo=jest&labelColor=f3f3f3&logoColor=944058)](https://jestjs.io/ru/)
[![runs with swagger](https://img.shields.io/badge/Runs%20with%20Swagger-000.svg?style=flat-square&logo=swagger&labelColor=f3f3f3&logoColor=#85EA2D)](https://swagger.io/)

# MERN-Social-Network

A Social Network developed with MERN stack. [OUTDATED]

## Features and Fuctionality

- Register user
- Verify user by email
- Login user
- Change user password
- Reset user password
- Add/Change User Information (education/skills/expiriences/etc..)
- Get current logined user information
- Logout user
- Get current user information by id
- Get all users information
- Users search
- Delete account

- Create experience
- Update experience
- Get own experiences
- Delete experience

- Create education
- Update education
- Get own educations
- Delete education

- Create language
- Update language
- Get own languages
- Delete language

- Create skill
- Update skill
- Get all skills
- Get own skill
- Get skill by id
- Skills search
- Add user to skill
- Remove user from skill
- Delete skill

- Create post
- Update post
- Get own posts
- Delete post

- Get all posts
- Get all popular skill
- Search post by id
- Get post by id

- Create media file
- Update media file
- Get media files
- Get own media files
- Get media files by id
- Delete media file

- Create comment
- Update comment
- Get own comments
- Delete comment

- Add like
- Remove like

## How to build your own..?

1. First install all dependencies with npm or Yarn:
   ```javascript
   npm install
   ```
   or
   ```javascript
   yarn;
   ```
2. Create a `.env` file and insert the following code. Replace values with yours!!

   ```javascript
   PORT = YOUR_PORT;
   DB_HOST = "mongo db";
   SECRET_KEY = "anything-secret";
   BASE_URL = "server base url";
   FRONTEND_BASE_URL = "front end base url";
   SENDGRID_API_KEY = "key for sendgrid ";
   MAILER_EMAIL = "social-network@info.com";
   ```

3. Start the server

   ```javascript
   npx nodemon server
   ```

4. Enjoy!!

**_NOTE: PLEASE LET ME KNOW IF YOU DISCOVERED ANY BUG OR YOU HAVE ANY SUGGESTIONS_**
