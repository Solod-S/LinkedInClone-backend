const { User, AccessToken } = require("../../models");

const querystring = require("query-string");
const axios = require("axios");
const jwt = require("jsonwebtoken");

const { BASE_HTTPS_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, FRONTEND_BASE_URL, ACCES_SECRET_KEY } = process.env;
const { transformers } = require("../../helpers/index");
const { googleUtils } = require("../../helpers");

const googleRedirect = async (req, res) => {
  const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;
  const urlObj = new URL(fullUrl);
  const urlParams = querystring.parse(urlObj.search);
  // гугл вернул код

  const code = urlParams.code;

  const tokenData = await axios({
    url: `https://oauth2.googleapis.com/token`,
    method: "post",
    data: {
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: `${BASE_HTTPS_URL}/auth/google-redirect`,
      grant_type: "authorization_code",
      code,
    },
  });
  // console.log(`tokenData`, tokenData);
  // делаем запрос гуглу за токеном для дальнейших запросов гуглу

  const userData = await axios({
    url: "https://www.googleapis.com/oauth2/v2/userinfo",
    method: "get",
    headers: {
      Authorization: `Bearer ${tokenData.data.access_token}`,
    },
  });
  // console.log(`userdata.data`, userData.data.email);
  // делаем запрос гуглу за инфой пользователя и получаем информацию о пользователе (userData.data)
  // дальше проверяем базу данных на наличие пользователя с имейлом userData.data.email если его нету регистрируем, если он есть мы пускаем юзера (даем токен)

  const userExist = await User.findOne({ email: userData.data.email });

  if (userExist) {
    const payload = {
      id: userExist._id,
    };

    const user = await User.findOne({ email: userData.data.email })
      .populate({
        path: "posts",
        options: { limit: 10, sort: { createdAt: -1 } },
        select: "description createdAt updatedAt",
        populate: [
          {
            path: "comments",
            options: { limit: 10, sort: { createdAt: -1 } },
            select: "owner description likes mediaFiles createdAt updatedAt",
            populate: {
              path: "owner",
              select: "_id surname name avatarURL",
              populate: { path: "avatarURL", select: "url" },
            },
          },
          {
            path: "likes",
            select: "owner type",
            populate: {
              path: "owner",
              select: "_id surname name avatarURL",
              populate: { path: "avatarURL", select: "url" },
            },
          },
          {
            path: "mediaFiles",
            select: "url type owner location createdAt updatedAt",
            populate: {
              path: "owner",
              select: "_id surname name avatarURL",
              populate: { path: "avatarURL", select: "url" },
            },
          },
        ],
      })
      .populate({
        path: "favorite",
        options: { limit: 10, sort: { createdAt: -1 } },
        select: "description createdAt updatedAt",
        populate: [
          {
            path: "comments",
            options: { limit: 10, sort: { createdAt: -1 } },
            select: "owner description likes mediaFiles createdAt updatedAt",
            populate: {
              path: "owner",
              select: "_id surname name avatarURL",
              populate: { path: "avatarURL", select: "url" },
            },
          },
          {
            path: "likes",
            select: "owner type",
            populate: {
              path: "owner",
              select: "_id surname name avatarURL",
              populate: { path: "avatarURL", select: "url" },
            },
          },
          {
            path: "mediaFiles",
            select: "url type owner location createdAt updatedAt",
            populate: {
              path: "owner",
              select: "_id surname name avatarURL",
              populate: { path: "avatarURL", select: "url" },
            },
          },
        ],
      })
      .populate({
        path: "subscription",
        options: { limit: 10, sort: { createdAt: -1 } },
        select:
          "name surname site phone headLine about languages education frame experience email avatarURL subscription posts",
        populate: [
          {
            path: "posts",
            options: { limit: 10, sort: { createdAt: -1 } },
            select: "description createdAt updatedAt",
            populate: [
              {
                path: "comments",
                options: { limit: 10, sort: { createdAt: -1 } },
                select: "owner description likes mediaFiles createdAt updatedAt",
                populate: {
                  path: "owner",
                  select: "_id surname name avatarURL",
                  populate: { path: "avatarURL", select: "url" },
                },
              },
              {
                path: "likes",
                select: "owner type",
                populate: {
                  path: "owner",
                  select: "_id surname name avatarURL",
                  populate: { path: "avatarURL", select: "url" },
                },
              },
              {
                path: "mediaFiles",
                select: "url type owner location createdAt updatedAt",
                populate: {
                  path: "owner",
                  select: "_id surname name avatarURL",
                  populate: { path: "avatarURL", select: "url" },
                },
              },
            ],
          },
          {
            path: "favorite",
            options: { limit: 10, sort: { createdAt: -1 } },
            select: "description createdAt updatedAt",
            populate: [
              {
                path: "comments",
                options: { limit: 10, sort: { createdAt: -1 } },
                select: "owner description likes mediaFiles createdAt updatedAt",
                populate: {
                  path: "owner",
                  select: "_id surname name avatarURL",
                  populate: { path: "avatarURL", select: "url" },
                },
              },
              {
                path: "likes",
                select: "owner type",
                populate: {
                  path: "owner",
                  select: "_id surname name avatarURL",
                  populate: { path: "avatarURL", select: "url" },
                },
              },
              {
                path: "mediaFiles",
                select: "url type owner location createdAt updatedAt",
                populate: {
                  path: "owner",
                  select: "_id surname name avatarURL",
                  populate: { path: "avatarURL", select: "url" },
                },
              },
            ],
          },
          {
            path: "subscription",
            options: { limit: 10, sort: { createdAt: -1 } },
            select:
              "name surname site phone headLine about languages education frame experience email avatarURL subscription posts",
            populate: { path: "avatarURL", select: "url" },
          },
          {
            path: "avatarURL",
            select: "url",
          },
        ],
      })
      .populate({
        path: "avatarURL",
        select: "url",
      });

    const token = jwt.sign(payload, ACCES_SECRET_KEY);
    const newToken = await AccessToken.create({ owner: userExist._id, token });
    user.accessTokens.push(newToken._id); // Добавляем новый токен к пользователю
    await user.save(); // Сохраняем обновленную информацию о пользователе

    res.status(200).json({
      status: "success",
      message: "Successful login",
      data: { user: transformers.userTransformer(user), accessToken: token },
    });
  } else {
    const token = await googleUtils.createGoogleUser(userData.data);

    const { id } = jwt.verify(token, ACCES_SECRET_KEY);

    const user = await User.findById(id)
      .populate({
        path: "posts",
        options: { limit: 10, sort: { createdAt: -1 } },
        select: "description createdAt updatedAt",
        populate: [
          {
            path: "comments",
            options: { limit: 10, sort: { createdAt: -1 } },
            select: "owner description likes mediaFiles createdAt updatedAt",
            populate: { path: "owner", select: "_id surname name avatarURL" },
          },
          { path: "likes", select: "owner type", populate: { path: "owner", select: "_id surname name avatarURL" } },
          {
            path: "mediaFiles",
            select: "url type owner location createdAt updatedAt",
            populate: { path: "owner", select: "_id surname name avatarURL" },
          },
        ],
      })
      .populate({
        path: "favorite",
        options: { limit: 10, sort: { createdAt: -1 } },
        select: "description createdAt updatedAt",
        populate: [
          {
            path: "comments",
            options: { limit: 10, sort: { createdAt: -1 } },
            select: "owner description likes mediaFiles createdAt updatedAt",
            populate: { path: "owner", select: "_id surname name avatarURL" },
          },
          { path: "likes", select: "owner type", populate: { path: "owner", select: "_id surname name avatarURL" } },
          {
            path: "mediaFiles",
            select: "url type owner location createdAt updatedAt",
            populate: { path: "owner", select: "_id surname name avatarURL" },
          },
        ],
      })
      .populate({
        path: "subscription",
        options: { limit: 10, sort: { createdAt: -1 } },
        select:
          "name surname site phone headLine about languages education frame experience email avatarURL subscription posts",
        populate: [
          {
            path: "posts",
            options: { limit: 10, sort: { createdAt: -1 } },
            select: "description createdAt updatedAt",
            populate: [
              {
                path: "comments",
                options: { limit: 10, sort: { createdAt: -1 } },
                select: "owner description likes mediaFiles createdAt updatedAt",
                populate: { path: "owner", select: "_id surname name avatarURL" },
              },
              {
                path: "likes",
                select: "owner type",
                populate: { path: "owner", select: "_id surname name avatarURL" },
              },
              {
                path: "mediaFiles",
                select: "url type owner location createdAt updatedAt",
                populate: { path: "owner", select: "_id surname name avatarURL" },
              },
            ],
          },
          {
            path: "favorite",
            options: { limit: 10, sort: { createdAt: -1 } },
            select: "description createdAt updatedAt",
            populate: [
              {
                path: "comments",
                options: { limit: 10, sort: { createdAt: -1 } },
                select: "owner description likes mediaFiles createdAt updatedAt",
                populate: { path: "owner", select: "_id surname name avatarURL" },
              },
              {
                path: "likes",
                select: "owner type",
                populate: { path: "owner", select: "_id surname name avatarURL" },
              },
              {
                path: "mediaFiles",
                select: "url type owner location createdAt updatedAt",
                populate: { path: "owner", select: "_id surname name avatarURL" },
              },
            ],
          },
          {
            path: "subscription",
            options: { limit: 10, sort: { createdAt: -1 } },
            select:
              "name surname site phone headLine about languages education frame experience email avatarURL subscription posts",
          },
        ],
      })
      .populate({
        path: "avatarURL",
        select: "url",
      });

    res.status(200).json({
      status: "success",
      message: "Successful login",
      data: { user: transformers.userTransformer(user), accessToken: token },
    });
  }

  // return res.redirect(`${FRONTEND_BASE_URL}?email=${userData.data.email}`);
  // тут нужно будет использовать в теле токен
  //  return res.redirect(`${FRONTEND_BASE_URL}/google-redirect?token=${тут токен который мы создадим}`);
  // с квери параметров будем брать токен
};
module.exports = googleRedirect;
