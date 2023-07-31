![Version](https://img.shields.io/badge/Version-0.7-blue.svg?cacheSeconds=2592000)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![runs with nodeJs](https://img.shields.io/badge/Runs%20with%20Node.Js-000.svg?style=flat-square&logo=nodedotjs&labelColor=f3f3f3&logoColor=#3C823B)](https://nodejs.org/ru)
[![runs with express](https://img.shields.io/badge/Runs%20with%20Express-000.svg?style=flat-square&logo=Express&labelColor=f3f3f3&logoColor=7D7D7D)](https://expressjs.com/ru/)
[![runs with mongodb](https://img.shields.io/badge/Runs%20with%20MongoDB-000.svg?style=flat-square&logo=mongodb&labelColor=f3f3f3&logoColor=#47A248)](https://swagger.io/)
[![runs with swagger](https://img.shields.io/badge/Runs%20with%20Swagger-000.svg?style=flat-square&logo=swagger&labelColor=f3f3f3&logoColor=#85EA2D)](https://swagger.io/)
[![runs with jest](https://img.shields.io/badge/Runs%20with%20Jest-000.svg?style=flat-square&logo=jest&labelColor=f3f3f3&logoColor=944058)](https://jestjs.io/ru/)
[![runs with nodemon](https://img.shields.io/badge/Runs%20with%20Nodemon-000.svg?style=flat-square&logo=nodemon&labelColor=f3f3f3&logoColor=nodemon)](https://www.npmjs.com/package/nodemon)
[![runs with PassportJs](https://img.shields.io/badge/Runs%20with%20PassportJs-000.svg?style=flat-square&logo=Passport&labelColor=f3f3f3&logoColor=35DF79)](https://www.passportjs.org/)

# MERN-Social-Network

![LinkedIn Clone Demo](/public/pictures/about.jpg)

A Social Network developed with MERN stack.

## Technologies Used

    express
    morgan
    nodemon
    dotenv
    mongoose
    joi
    jsonwebtoken
    passport-google-oauth20
    bcrypt
    cors
    cross-env
    sendgrid
    swagger-ui-express
    jest
    supertest
    chance
    human-time
    multer
    chalk
    uuid

## Project structure

```sh
.
├── app.js
├── server.js
├── package.json
├── .env
├── .env.example
├── README.md
├── controllers
│   ├── auth
│   │   ├── devRegister.js
│   │   ├── devResendVerifyEmail.js
│   │   ├── getCurrent.js
│   │   ├── googleAuth.js
│   │   ├── googleRedirect.js
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
├── middlewares
│   ├── jwt.js
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
   ```

3. Start the server

   ```javascript
   npx nodemon server
   ```

4. Enjoy!!

## Features and Fuctionality

#### User account operations

![LinkedIn Clone Demo](/public/pictures/structure.gif)

#### Auth operations

- Register user
- Verify user by email
- Login user
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

## Contributing

Contributions are welcome! If you have any suggestions or improvements, please create a pull request. For major changes, please open an issue first to discuss the changes.

**_NOTE: PLEASE LET ME KNOW IF YOU DISCOVERED ANY BUG OR YOU HAVE ANY SUGGESTIONS_**
