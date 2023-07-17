const userTransformer = ({
  _id,
  name,
  surname,
  email,
  avatarURL,
  favorite,
  posts,
  subscription,
  phone,
  site,
  other1,
  other2,
  other3,
  about,
  experience,
  education,
  skills,
  languages,
  headLine,
  frame,
}) => ({
  _id,
  name,
  surname,
  email,
  // avatarURL: avatarURL ? avatarURL.url : "",
  avatarURL,
  favorite,
  posts,
  subscription,
  phone,
  site,
  other1,
  other2,
  other3,
  about,
  experience,
  education,
  skills,
  languages,
  headLine,
  frame,
});

module.exports = userTransformer;
