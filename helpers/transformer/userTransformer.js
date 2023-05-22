const userTransformer = (user) => {
  return {
    _id: user._id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    avatarURL: user.avatarURL,
  };
};

module.exports = userTransformer;
