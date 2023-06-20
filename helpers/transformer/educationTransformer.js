const human = require("human-time");

const educationTransformer = ({
  _id,
  owner,
  school,
  degree,
  fieldOfStudy,
  activitiesAndSocieties,
  description,
  startDate,
  endDate,
  skills,
  mediaFiles,
  createdAt,
  updatedAt,
}) => ({
  _id,
  owner,
  school,
  degree,
  fieldOfStudy,
  activitiesAndSocieties,
  description,
  startDate,
  endDate,
  skills,
  mediaFiles,
  postedAtHuman: human(createdAt),
  createdAt,
  updatedAt,
});

module.exports = educationTransformer;
