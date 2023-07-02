const { User } = require("../../models");
const { userTransformer, postTransformer } = require("../../helpers/index");

const getAllUsers = async (req, res, next) => {
  let page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;

  const count = await User.countDocuments();
  const totalPages = Math.ceil(count / perPage);

  if (page > totalPages) {
    page = totalPages;
  }

  const skip = (page - 1) * perPage;

  if ((await User.find({})).length <= 0) {
    return res.json({
      status: "success",
      data: {
        users: [],
        message: "No users were found",
        totalPages,
        currentPage: page,
        perPage,
      },
    });
  }

  const users = await User.find({})
    .sort({ createdAt: -1 })
    .skip(skip < 0 ? 0 : skip)
    .limit(perPage)
    .populate({
      path: "posts",
      select: "description createdAt updatedAt",
      populate: [
        {
          path: "comments",
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
      select: "description createdAt updatedAt",
      populate: [
        {
          path: "comments",
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
      select:
        "name surname site phone headLine about languages education frame experience email avatarURL subscription posts",
      populate: [
        {
          path: "posts",
          select: "description createdAt updatedAt",
          populate: [
            {
              path: "comments",
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
        },
        {
          path: "favorite",
          select: "description createdAt updatedAt",
          populate: [
            {
              path: "comments",
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
        },
        {
          path: "subscription",
          select:
            "name surname site phone headLine about languages education frame experience email avatarURL subscription posts",
        },
      ],
    });

  const transformedUsers = users.map((user) => {
    const transformedUser = userTransformer(user);
    transformedUser.posts = user.posts.map((post) => postTransformer(post));
    return transformedUser;
  });

  res.status(200).json({
    status: "success",
    message: "We successfully found users",
    data: {
      users: transformedUsers,
      totalPages,
      currentPage: page,
      perPage,
    },
  });
};

module.exports = getAllUsers;

// const users = await User.aggregate([
//   {
//     $lookup: {
//       from: "posts",
//       localField: "_id",
//       foreignField: "owner",
//       as: "posts",
//     },
//   },
//   {
//     $unwind: {
//       path: "$posts",
//       preserveNullAndEmptyArrays: true,
//     },
//   },
//   {
//     $sort: {
//       "posts.createdAt": -1,
//     },
//   },
//   {
//     $skip: skip < 0 ? 0 : skip,
//   },
//   {
//     $limit: perPage,
//   },
//   {
//     $lookup: {
//       from: "likes",
//       localField: "posts.likes",
//       foreignField: "_id",
//       as: "posts.likes",
//     },
//   },
//   {
//     $lookup: {
//       from: "comments",
//       localField: "posts.comments",
//       foreignField: "_id",
//       as: "posts.comments",
//     },
//   },
//   {
//     $lookup: {
//       from: "mediafiles",
//       localField: "posts.mediaFiles",
//       foreignField: "_id",
//       as: "posts.mediaFiles",
//     },
//   },
//   {
//     $group: {
//       _id: "$_id",
//       name: { $first: "$name" },
//       email: { $first: "$email" },
//       surname: { $first: "$surname" },
//       createdAt: { $first: "$createdAt" },
//       posts: { $push: "$posts" },
//     },
//   },
// ]);

// $match: Этот этап фильтрует пользователей на основе userQuery, которое содержит ключевое слово для поиска. В результате остаются только пользователи, у которых поле name соответствует заданному ключевому слову (регистронезависимый поиск).

// $lookup: Этот этап выполняет "связывание" (join) между коллекциями users и posts. Он ищет все записи в коллекции posts, у которых поле owner соответствует _id пользователя в коллекции users, и добавляет найденные посты в поле posts каждого пользователя.

// $unwind: Этот этап "разворачивает" (unwind) массив posts в каждом пользователе. Он создает отдельные документы для каждого поста в массиве posts, сохраняя остальные поля пользователя в каждом документе. Это позволяет обрабатывать каждый пост отдельно в последующих этапах.

// $sort: Этот этап сортирует документы в соответствии с датой создания поста (posts.createdAt) в обратном порядке. Таким образом, посты будут отсортированы от самых новых до самых старых.

// $skip: Этот этап пропускает определенное количество документов, основываясь на значении skip. Значение skip рассчитывается на основе номера страницы и количества элементов на странице. Если skip меньше нуля, то устанавливается значение 0, чтобы избежать отрицательного смещения.

// $limit: Этот этап ограничивает количество возвращаемых документов до значения perPage, которое определяет количество пользователей на странице.

// $group: Этот этап группирует документы по _id пользователя и объединяет поля name, email, createdAt и posts в каждой группе. Он использует операторы агрегации, такие как $first и $push, чтобы сохранить только одно значение для каждого поля в группе.
