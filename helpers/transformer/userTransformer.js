const userTransformer = (user) => {
  return {
    _id: user._id,
    name: user.name,
    surname: user.surname,
    email: user.email,
    avatarURL: user.avatarURL,
    //
    favorite: user.favorite,
    posts: user.favorite,
    subscription: user.subscription,
    phone: user.phone,
    site: user.site,
    other_1: user.other_1,
    other_2: user.other_2,
    other_3: user.other_3,
    about: user.about,
    experience: user.experience,
    education: user.education,
    languages: user.languages,
    headLine: user.headLine,
    frame: user.frame,
  };
};

module.exports = userTransformer;
