const axios = require("axios");
const bcrypt = require("bcrypt");
const uuid = require("uuid");
const { User } = require("../models");
const { INSTAGRAM_CLIENT_ID, INSTAGRAM_CLIENT_SECRET } = process.env;

const instagramAuth = async (req, res, next) => {
  try {
    const code = req.query.code;

    // Формируем данные для запроса на обмен кода на токен
    const formData = new URLSearchParams();
    formData.append("client_id", INSTAGRAM_CLIENT_ID);
    formData.append("client_secret", INSTAGRAM_CLIENT_SECRET);
    formData.append("code", code);
    formData.append("grant_type", "authorization_code");
    formData.append("redirect_uri", "https://localhost:3000/auth/instagram-redirect");

    // Выполняем POST запрос на обмен кода на токен
    const tokenResponse = await axios.post("https://api.instagram.com/oauth/access_token", formData, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    // Получаем access token из ответа
    const accessToken = tokenResponse.data.access_token;

    // Выполняем запрос к Instagram API с использованием полученного access token
    const instagramResponse = await axios.get(
      `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`
    );

    // Получаем id пользователя Instagram из ответа
    const { id, username } = instagramResponse.data;
    console.log(`instagramResponse.data`, instagramResponse.data);

    // Формируем email и отправляем его в ответ
    const email = `${id}@gmail.com`;
    console.log(`email`, email);

    // работаем с почтой

    const user = await User.findOne({ email });
    console.log(`user`, user);
    if (user) {
      const currentUser = await User.findOne({ email })
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
      req.user = user;
      return next();
      // передает работу дальше и закрепляет в req.user = user
    }
    const codeV4 = uuid.v4();
    const password = await bcrypt.hash(codeV4, 10);
    const newUser = await User.create({
      email,
      password,
      name: username,
      surname: username,
      verify: true,
    });
    console.log(`newUser`, newUser);
    req.user = user;
    return next();
    // передает работу дальше и закрепляет в req.user = newUser
  } catch (error) {
    console.error("Error fetching Instagram user data:", error.message);
    res.status(500).send("Error fetching Instagram user data");
  }
};

module.exports = instagramAuth;
