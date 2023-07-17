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

## Project structure

```sh
.
├── app.js
├── package.json
├── controllers
│   ├── comments
│   │   ├── addComment
│   │   ├── deleteOwnComment
│   │   ├── getAllComments
│   │   └── updateOwnComment
│   ├── companies
│   │   ├── createCompany
│   │   ├── deleteCompany
│   │   ├── getAllCompanies
│   │   ├── getCompaniesByQuery
│   │   ├── getCompanyById
│   │   ├── ownerAdd
│   │   ├── ownerRemove
│   │   ├── updateCompany
│   │   ├── workerAdd
│   │   └── workerRemove
│   ├── educations
│   │   ├── addEducation
│   │   ├── deleteEducation
│   │   ├── getOwnEducations
│   │   └── updateEducation
│   ├── experiences
│   │   ├── addExperience
│   │   ├── deleteExperience
│   │   ├── getOwnExperience
│   │   └── updateExperience
│   ├── favorites
│   │   ├── addFavorite
│   │   ├── deleteFavorite
│   │   └── getOwnFavorite
│   ├── jobs
│   │   ├── applyJobById
│   │   ├── getAllJobs
│   │   ├── getAppliedJobs
│   │   ├── getJobById
│   │   ├── getJobsByQuery
│   │   ├── getPopularJobs
│   │   └── unApplyJobById
│   ├── languages
│   │   ├── addLanguage
│   │   ├── deleteLanguage
│   │   ├── getOwnLanguage
│   │   └── updateLanguage
│   ├── likes
│   │   ├── addLike
│   │   └── deleteLike
│   ├── mediaFiles
│   │   ├── addMediaFile
│   │   ├── deleteMediaFile
│   │   ├── getAllMediaFiles
│   │   ├── getMediaFileById
│   │   └── updateOwnMediaFile
│   ├── ownJobs
│   │   ├── addOwnJob
│   │   ├── deleteOwnJob
│   │   ├── getOwnJobs
│   │   └── updateOwnJob
│   ├── ownPosts
│   │   ├── addOwnPost
│   │   ├── deleteOwnPost
│   │   ├── getOwnPosts
│   │   └── updateOwnPost
│   ├── ownPublications
│   │   ├── addOwnPublication
│   │   ├── deleteOwnPublication
│   │   ├── getOwnPublications
│   │   └── updateOwnPublication
│   ├── posts
│   │   ├── getAllPosts
│   │   ├── getPopularPosts
│   │   ├── getPostById
│   │   └── getPostsByQuery
│   ├── publications
│   │   ├── getAllPublications
│   │   ├── getPopularPublications
│   │   ├── getPublicationById
│   │   └── getPublicationsByQuery
│   ├── skills
│   │   ├── createSkill
│   │   ├── deleteSkill
│   │   ├── getAllSkills
│   │   ├── getOwnSkills
│   │   ├── getSkillById
│   │   ├── getSkillByQuery
│   │   ├── updateSkill
│   │   ├── userAdd
│   │   └── userRemove
│   └── users
│   │   ├── getAllUsers
│   │   ├── getCurrent
│   │   ├── getUserById
│   │   ├── getUsersByQuery
│   │   ├── passwordChange
│   │   ├── passwordReset
│   │   ├── passwordResetByEmail
│   │   ├── resendVerifyEmail
│   │   ├── userDelete
│   │   ├── userLogin
│   │   ├── userLogout
│   │   ├── userRegister
│   │   ├── userUpdate
│   │   └── verifyEmail
├── models
│   ├── BookModel.js
│   └── UserModel.js
├── routes
│   ├── api.js
│   ├── auth.js
│   └── book.js
├── middlewares
│   ├── jwt.js
├── helpers
│   ├── apiResponse.js
│   ├── constants.js
│   ├── mailer.js
│   └── utility.js
├── test
│   ├── testConfig.js
│   ├── auth.js
│   └── book.js
└── public
    ├── index.html
    └── stylesheets
        └── style.css
```

## How to install

### Using Git (recommended)

1.  Clone the project from github. Change "myproject" to your project name.

```bash
git clone https://github.com/maitraysuthar/rest-api-nodejs-mongodb.git ./myproject
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

## Future Plans

- Write SPA (React/Redux/Axios/...)
- Write mobile aplication (ReactNative/ExpoCLI/...)

## Contributing

Contributions are welcome! If you have any suggestions or improvements, please create a pull request. For major changes, please open an issue first to discuss the changes.

**_NOTE: PLEASE LET ME KNOW IF YOU DISCOVERED ANY BUG OR YOU HAVE ANY SUGGESTIONS_**
