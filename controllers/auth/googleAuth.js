const querystring = require("query-string");

const { BASE_HTTPS_URL, GOOGLE_CLIENT_ID } = process.env;

const googleAuth = async (req, res) => {
  const stringifiedParams = querystring.stringify({
    client_id: GOOGLE_CLIENT_ID,
    redirect_uri: `${BASE_HTTPS_URL}/auth/google-redirect`,
    scope: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"].join(
      " "
    ),
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
  });

  return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${stringifiedParams}`);
};
// отдаем управление гуглу с парамертами о нашем приложении
module.exports = googleAuth;
