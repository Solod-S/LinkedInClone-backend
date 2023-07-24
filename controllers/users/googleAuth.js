const querystring = require("query-string");

const { BASE_URL, GOOGLE_CLIENT_ID } = process.env;

const googleAuth = async (req, res) => {
  console.log(`googleAuth`);
  const stringifiedParams = querystring.stringify({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: `${BASE_URL}/users/google-redirect`,
    scope: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"].join(
      " "
    ),
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
  });
  console.log(stringifiedParams);
  return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`);
};
// отдаем управление гуглу с парамертами о нашем приложении
module.exports = googleAuth;
