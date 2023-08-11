![Version](https://img.shields.io/badge/Version-0.7-blue.svg?cacheSeconds=2592000)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![runs with nodeJs](https://img.shields.io/badge/Runs%20with%20Node.Js-000.svg?style=flat-square&logo=nodedotjs&labelColor=f3f3f3&logoColor=#3C823B)](https://nodejs.org/ru)
[![runs with express](https://img.shields.io/badge/Runs%20with%20Express-000.svg?style=flat-square&logo=Express&labelColor=f3f3f3&logoColor=7D7D7D)](https://expressjs.com/ru/)
[![runs with mongodb](https://img.shields.io/badge/Runs%20with%20MongoDB-000.svg?style=flat-square&logo=mongodb&labelColor=f3f3f3&logoColor=#47A248)](https://www.mongodb.com/)
[![runs with swagger](https://img.shields.io/badge/Runs%20with%20Swagger-000.svg?style=flat-square&logo=swagger&labelColor=f3f3f3&logoColor=#85EA2D)](https://swagger.io/)
[![runs with jest](https://img.shields.io/badge/Runs%20with%20Jest-000.svg?style=flat-square&logo=jest&labelColor=f3f3f3&logoColor=944058)](https://jestjs.io/ru/)
[![runs with nodemon](https://img.shields.io/badge/Runs%20with%20Nodemon-000.svg?style=flat-square&logo=nodemon&labelColor=f3f3f3&logoColor=nodemon)](https://www.npmjs.com/package/nodemon)
[![runs with PassportJs](https://img.shields.io/badge/Runs%20with%20PassportJs-000.svg?style=flat-square&logo=Passport&labelColor=f3f3f3&logoColor=35DF79)](https://www.passportjs.org/)

# MERN-Social-Network

![LinkedIn Clone Demo](/public/pictures/about.jpg)

**Project Description:**

The project is a Social Network built using the MERN stack, which stands for MongoDB, Express, React, and Node.js. The goal of this project is to create a web-based social networking platform that allows users to connect, interact, and share content with each other.

![LinkedIn Clone Demo](/public/pictures/passport-js-min.jpg)

**Main Technologies:**

- Express: Express is a web application framework for Node.js that simplifies the process of building robust and scalable web applications. It provides a set of tools and features to handle routing, middleware, and HTTP requests.
- Mongoose: Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a way to define data models using JavaScript objects and interact with MongoDB databases.
- Passport: Passport is an authentication middleware for Node.js that offers a variety of authentication strategies. In this project, strategies like passport-facebook, passport-github2, passport-google-oauth2, and passport-linkedin-oauth2 are used to enable social media authentication.
- SendGrid: SendGrid is a cloud-based email delivery service that is used to handle email notifications and communication within the application.
- jsonwebtoken: JSON Web Tokens (JWT) are used for secure authentication and authorization. They are used to create and verify tokens for user authentication.
- bcrypt: Bcrypt is a password-hashing library used to securely hash and store user passwords in the database.
- swagger-ui-express: Swagger UI Express is used to generate interactive API documentation. It provides a user-friendly interface for developers to understand and test the available API endpoints.
- jest: Jest is a testing framework for JavaScript that is often used for unit and integration testing. It helps ensure the reliability and correctness of the application code.
- supertest: Supertest is a testing library that allows you to make HTTP requests and assert the responses. It is often used in combination with Jest for testing APIs.
  nodemon: Nodemon is a utility that monitors changes in the source code and automatically restarts the server during development. This saves developers from manually restarting the server after code changes.

By leveraging these technologies, the Social Network project aims to provide users with a seamless and engaging experience, allowing them to connect with others, share content, and make use of social media authentication for ease of access. The MERN stack, along with the various libraries and tools, ensures the development of a modern and feature-rich social networking platform.

## Technologies Used

![LinkedIn Clone Demo](/public/pictures/test-min.jpg)

    express
    mongoose
    passport
    passport-facebook
    passport-github2
    passport-google-oauth2
    passport-linkedin-oauth2
    sendgrid
    jsonwebtoken
    bcrypt
    swagger-ui-express
    jest
    supertest
    morgan
    nodemon
    dotenv
    joi
    cors
    cross-env
    chance
    human-time
    multer
    chalk
    uuid

![LinkedIn Clone Demo](/public/pictures/email-min.jpg)

## Project structure

```sh
.
├── app.js
├── server.js
├── package.json
├── .env
├── .env.example
├── README.md
├── certificates
│   ├── cert.pem
│   ├── csr.pem
│   └── key.pem
├── controllers
│   ├── auth
│   │   ├── devRegister.js
│   │   ├── devResendVerifyEmail.js
│   │   ├── getCurrent.js
│   │   ├── googleAuth.js
│   │   ├── googleRedirect.js
│   │   ├── googlePassportAuth.js
│   │   ├── facebookPassportAuth.js
│   │   ├── githubPassportAuth.js
│   │   ├── linkedInPassportAuth.js
│   │   ├── passwordChange.js
│   │   ├── passwordReset.js
│   │   ├── passwordResetByEmail.js
│   │   ├── resendVerifyEmail.js
│   │   ├── userLogin.js
│   │   ├── userLogout.js
│   │   ├── userRefreshToken.js
│   │   ├── userRegister.js
│   │   ├── verifyEmail.js
│   │   └── index.js
│   ├── comments
│   │   ├── addComment.js
│   │   ├── deleteOwnComment.js
│   │   ├── getAllComments.js
│   │   ├── updateOwnComment.js
│   │   └── index.js
│   ├── companies
│   │   ├── createCompany.js
│   │   ├── deleteCompany.js
│   │   ├── getAllCompanies.js
│   │   ├── getCompaniesByQuery.js
│   │   ├── getCompanyById.js
│   │   ├── ownerAdd.js
│   │   ├── ownerRemove.js
│   │   ├── updateCompany.js
│   │   ├── workerAdd.js
│   │   ├── workerRemove.js
│   │   └── index.js
│   ├── educations
│   │   ├── addEducation.js
│   │   ├── deleteEducation.js
│   │   ├── getOwnEducations.js
│   │   ├── updateEducation.js
│   │   └── index.js
│   ├── experiences
│   │   ├── addExperience.js
│   │   ├── deleteExperience.js
│   │   ├── getOwnExperience.js
│   │   ├── updateExperience.js
│   │   └── index.js
│   ├── favorites
│   │   ├── addFavorite.js
│   │   ├── deleteFavorite.js
│   │   ├── getFavorite.js
│   │   └── index.js
│   ├── jobs
│   │   ├── applyJobById.js
│   │   ├── getAllJobs.js
│   │   ├── getAppliedJobs.js
│   │   ├── getJobById.js
│   │   ├── getJobsByQuery.js
│   │   ├── getPopularJobs.js
│   │   ├── unApplyJobById.js
│   │   └── index.js
│   ├── languages
│   │   ├── addLanguage.js
│   │   ├── deleteLanguage.js
│   │   ├── getOwnLanguage.js
│   │   ├── updateLanguage.js
│   │   └── index.js
│   ├── likes
│   │   ├── addLike.js
│   │   ├── deleteLike.js
│   │   └── index.js
│   ├── mediaFiles
│   │   ├── addMediaFile.js
│   │   ├── deleteMediaFile.js
│   │   ├── getAllMediaFiles.js
│   │   ├── getMediaFileById.js
│   │   ├── updateOwnMediaFile.js
│   │   └── index.js
│   ├── ownJobs
│   │   ├── addOwnJob.js
│   │   ├── deleteOwnJob.js
│   │   ├── getOwnJobs.js
│   │   ├── updateOwnJob.js
│   │   └── index.js
│   ├── ownPosts
│   │   ├── addOwnPost.js
│   │   ├── deleteOwnPost.js
│   │   ├── getOwnPosts.js
│   │   ├── updateOwnPost.js
│   │   └── index.js
│   ├── ownPublications
│   │   ├── addOwnPublication.js
│   │   ├── deleteOwnPublication.js
│   │   ├── getOwnPublications.js
│   │   ├── updateOwnPublication.js
│   │   └── index.js
│   ├── posts
│   │   ├── getAllPosts.js
│   │   ├── getPopularPosts.js
│   │   ├── getPostById.js
│   │   ├── getPostsByQuery.js
│   │   └── index.js
│   ├── publications
│   │   ├── getAllPublications.js
│   │   ├── getPopularPublications.js
│   │   ├── getPublicationById.js
│   │   ├── getPublicationsByQuery.js
│   │   └── index.js
│   ├── skills
│   │   ├── createSkill.js
│   │   ├── deleteSkill.js
│   │   ├── getAllSkills.js
│   │   ├── getOwnSkills.js
│   │   ├── getSkillById.js
│   │   ├── getSkillByQuery.js
│   │   ├── updateSkill.js
│   │   ├── userAdd.js
│   │   ├── userRemove.js
│   │   └── index.js
│   ├── subscriptions
│   │   ├── addSubscription.js
│   │   ├── deleteSubscription.js
│   │   ├── getSubscriptions.js
│   │   └── index.js
│   └── users
│   │   ├── getAllUsers.js
│   │   ├── getUserById.js
│   │   ├── getUsersByQuery.js
│   │   ├── userDelete.js
│   │   ├── userUpdate.js
│   │   ├── verifyEmail.js
│   │   └── index.js
│   └── index.js
├── helpers
│   ├── email
│   │   ├── createRestorePasswordEmail.js
│   │   ├── createVerifyEmail.js
│   │   ├── sendEmail.js
│   │   └── index.js
│   ├── google
│   │   ├── createGoogleUser.js
│   │   └── index.js
│   ├── testsUtils
│   │   ├── createUser.js
│   │   ├── deleteUser.js
│   │   └── index.js
│   ├── transformer
│   │   ├── commentTransformer.js
│   │   ├── companyTransformer.js
│   │   ├── educationTransformer.js
│   │   ├── experienceTransformer.js
│   │   ├── jobTransformer.js
│   │   ├── languageTransformer.js
│   │   ├── likeTransformer.js
│   │   ├── mediaFileTransformer.js
│   │   ├── postTransformer.js
│   │   ├── publicationTransformer.js
│   │   ├── skillTransformer.js
│   │   ├── userTransformer.js
│   │   └── index.js
│   ├── utils
│   │   └── handleMongooseError.js
│   └── index.js
├── middlewares
│   ├── auth.js
│   ├── ctrlWrapper.js
│   ├── facebook-authenticate.js
│   ├── github-authenticate.js
│   ├── google-authenticate.js
│   ├── linkedIn-authenticate.js
│   ├── isAdminMiddleware.js
│   ├── validateBody.js
│   └── index.js
├── models
│   ├── accessTokens.js
│   ├── comments.js
│   ├── companies.js
│   ├── educations.js
│   ├── experience.js
│   ├── jobs.js
│   ├── language.js
│   ├── likes.js
│   ├── mediaFiles.js
│   ├── posts.js
│   ├── publications.js
│   ├── refreshToken.js
│   ├── skills.js
│   ├── users.js
│   └── index.js
├── routes
│   ├── pictures
│   │   └── structure.gif
│   └── home.html
├── routes
│   ├── api
│   │   ├── auth.js
│   │   ├── comments.js
│   │   ├── companies.js
│   │   ├── educations.js
│   │   ├── experiences.js
│   │   ├── favorites.js
│   │   ├── jobs.js
│   │   ├── languages.js
│   │   ├── likes.js
│   │   ├── mediaFiles.js
│   │   ├── ownJobs.js
│   │   ├── ownPosts.js
│   │   ├── ownPublications.js
│   │   ├── posts.js
│   │   ├── publications.js
│   │   ├── skills.js
│   │   ├── subscriptions.js
│   │   ├── users.js
│   │   └── index.js
│   ├── errors
│   │   └── HttpErrors.js
│   └── swagger
│   │   └── openapi.js
├── tests
│   ├── 1_auth.test.js
│   ├── 2_user.test.js
│   ├── 3_experience.test.js
│   ├── 4_educations.test.js
│   ├── 5_languages.test.js
│   ├── 6_skills.test.js
│   ├── 7_ownPosts.test.js
│   ├── 8_posts.test.js
│   ├── 9_mediaFiles.test.js
│   ├── 10_comments.test.js
│   ├── 11_likes.test.js
│   ├── 12_favorites.test.js
│   ├── 13_subscriptions.test.js
│   ├── 14_companies.test.js
│   ├── 15_ownPublications.test.js
│   ├── 16_publications.test.js
│   ├── 17_ownJobs.test.js
│   └── 18_jobs.test.js
├── helpers
│   ├── apiResponse.js
│   ├── constants.js
│   ├── mailer.js
│   └── utility.js
└── public
    ├── index.html
    └── stylesheets
        └── style.css
```

## How to install

### Using Git (recommended)

1.  Clone the project from github. Change "myproject" to your project name.

```bash
git clone https://github.com/Solod-S/LinkedInClone-backend.git ./myproject
```

### Using manual download ZIP

1.  Download repository
2.  Uncompress to your desired directory

### Install npm dependencies after installing (Git or manual download)

```bash
cd myproject
npm install
```

### Setting up environments

1.  You will find a file named `.env.example` on root directory of project.
2.  Create a new file by copying and pasting the file and then renaming it to just `.env`
    ```bash
    cp .env.example .env
    ```
3.  The file `.env` is already ignored, so you never commit your credentials.
4.  Change the values of the file to your environment. Helpful comments added to `.env.example` file to understand the constants.

## How to build your own..

1. First install all dependencies with npm or Yarn:
   ```javascript
   npm install
   ```
   or
   ```javascript
   yarn;
   ```
2. Exemple of `.env` file. Replace values with yours!!

   ```javascript
   PORT = YOUR_PORT;
   DB_HOST = "mongo db";
   BASE_URL = "api url";
   ACCES_SECRET_KEY = "anything-secret";
   REFRESH_SECRET_KEY = "anything-secret";
   FRONTEND_BASE_URL = "frontend url";
   SENDGRID_API_KEY = "sendgrid api key";
   GOOGLE_CLIENT_ID = "google client id from google_console=>credentials";
   GOOGLE_CLIENT_SECRET = "google client secret from google console=>credentials";
   MAILER_EMAIL = "email for sending emails";
   WRONG_TOKEN = "tokens for tests";
   ADMINS = ["admin email"];
   GOOGLE_CLIENT_ID = "client id";
   GOOGLE_CLIENT_SECRET = "client secret";
   LINKEDIN_CLIENT_ID = "client id";
   LINKEDIN_CLIENT_SECRET = "client secret";
   FACEBOOK_CLIENT_ID = "client id";
   FACEBOOK_CLIENT_SECRET = "client secret";
   GITHUB_CLIENT_ID = "client id";
   GITHUB_CLIENT_SECRET = "client secret";
   ```

3. Start the server

   ```javascript
   npx nodemon server(serverhttps)
   ```

4. Enjoy!!

## Features and Fuctionality

#### User account operations

![LinkedIn Clone Demo](/public/pictures/structure.gif)

#### Auth operations

- Register user
- Verify user by email
- Login user by email
- Login user by google
- Login user by github
- Login user by facebook
- Login user by linkedin
- Change user password
- Reset user password
- Get current logined user information
- Logout user

#### User operations

- Add/Change User Information (education/skills/expiriences/etc..)
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

#### User subsciptions operations

- Get all subsciptions
- Add to subsciptions
- Remove from subsciptions

#### Media files operations

- Create media file (for posts, publications, avatars and etc)
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

## Future Plans

- Write SPA (React/Redux/Axios/...)
- Write mobile aplication (ReactNative/ExpoCLI/...)
- Add chat functionality aplication (Socket.io)

## Contributing

Contributions are welcome! If you have any suggestions or improvements, please create a pull request. For major changes, please open an issue first to discuss the changes.

**_NOTE: PLEASE LET ME KNOW IF YOU DISCOVERED ANY BUG OR YOU HAVE ANY SUGGESTIONS_**
