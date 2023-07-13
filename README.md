![Version](https://img.shields.io/badge/Version-0.7-blue.svg?cacheSeconds=2592000)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![runs with nodeJs](https://img.shields.io/badge/Runs%20with%20Node.Js-000.svg?style=flat-square&logo=nodedotjs&labelColor=f3f3f3&logoColor=#3C823B)](https://nodejs.org/ru)
[![runs with express](https://img.shields.io/badge/Runs%20with%20Express-000.svg?style=flat-square&logo=Express&labelColor=f3f3f3&logoColor=7D7D7D)](https://expressjs.com/ru/)
[![runs with mongodb](https://img.shields.io/badge/Runs%20with%20MongoDB-000.svg?style=flat-square&logo=mongodb&labelColor=f3f3f3&logoColor=#47A248)](https://swagger.io/)
[![runs with swagger](https://img.shields.io/badge/Runs%20with%20Swagger-000.svg?style=flat-square&logo=swagger&labelColor=f3f3f3&logoColor=#85EA2D)](https://swagger.io/)
[![runs with jest](https://img.shields.io/badge/Runs%20with%20Jest-000.svg?style=flat-square&logo=jest&labelColor=f3f3f3&logoColor=944058)](https://jestjs.io/ru/)
[![runs with nodemon](https://img.shields.io/badge/Runs%20with%20Nodemon-000.svg?style=flat-square&logo=nodemon&labelColor=f3f3f3&logoColor=nodemon)](https://www.npmjs.com/package/nodemon)

# MERN-Social-Network

A Social Network developed with MERN stack.

## Features and Fuctionality

#### User account operations

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

#### User experiences operations

- Create experience
- Update experience
- Get own experiences
- Delete experience

#### User educations operations

- Create education
- Update education
- Get own educations
- Delete education

#### User languages operations

- Create language
- Update language
- Get own languages
- Delete language

#### User skills operations

- Create skill
- Update skill
- Get all skills
- Get own skill
- Get skill by id
- Skills search
- Add user to skill
- Remove user from skill
- Delete skill

#### User posts operations

- Create post
- Update post
- Get own posts
- Delete post
- Get all posts
- Get all popular skill
- Search post by query
- Get post by id

#### User favorites operations

- Get all favorites
- Add to favorites
- Remove from favorites

#### Media files operations

- Create media file
- Update media file
- Get media files
- Get own media files
- Get media files by id
- Delete media file

#### Comments operations

- Create comment
- Update comment
- Get own comments
- Delete comment

#### Likes operations

- Add like
- Remove like

#### Company operations

- Create company
- Update company
- Add worker to company
- Remove worker from company
- Add owner to company
- Remove owner from company
- Get all companies
- Companies search
- Get company by id
- Delete company
- Create company publication
- Update company publication
- Get own company publications
- Delete company publication

#### Company publications operations

- Get all companies publications
- Get all popular companies publications
- Search companies publications by query
- Get company publication by id

#### Company jobs operations

- Create company job (vacancy)
- Update company job (vacancy)
- Get own company jobs (vacancies)
- Delete company job (vacancy)
- Get all companies jobs (vacancy)
- Get all popular companies jobs (vacancy)
- Get all applied companies jobs (vacancy)
- Search companies jobs (vacancy) by query
- Get company jobs (vacancy) by id
- Apply for a job
- Unapply from a job

## Technologies Used
    express
    morgan
    nodemon
    dotenv
    mongoose
    joi
    jsonwebtoken
    bcrypt
    cors
    cross-env
    sendgrid
    swagger-ui-express
    jest
    supertest
    chance
    gravatar
    human-time
    multer
    chalk
    uuid

## Future Plans

- Write SPA (React/Redux/Axios...)
- Write mobile aplication (ReactNative/ExpoCLI)

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


## Contributing

Contributions are welcome! If you have any suggestions or improvements, please create a pull request. For major changes, please open an issue first to discuss the changes.

**_NOTE: PLEASE LET ME KNOW IF YOU DISCOVERED ANY BUG OR YOU HAVE ANY SUGGESTIONS_**
