const userTransformer = (user) => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    avatarURL: user.avatarURL,
  };
};

module.exports = userTransformer;
