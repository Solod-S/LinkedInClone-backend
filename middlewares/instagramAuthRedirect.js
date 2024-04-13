const instagramAuthRedirect = (req, res, next) => {
  return res.redirect(
    `https://api.instagram.com/oauth/authorize?client_id=1345953132757866&redirect_uri=https://localhost:3000/auth/instagram-redirect&response_type=code&scope=user_profile,user_media`
  );
};

module.exports = instagramAuthRedirect;
