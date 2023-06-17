const human = require("human-time");

const experienceTransformer = ({
  _id,
  owner,
  companyName,
  employmentType,
  position,
  location,
  locationType,
  startDate,
  endDate,
  skills,
  mediaFiles,
  createdAt,
  updatedAt,
}) => ({
  _id,
  owner,
  companyName,
  employmentType,
  position,
  location,
  locationType,
  startDate,
  endDate,
  skills,
  mediaFiles,
  postedAtHuman: human(createdAt),
  createdAt,
  updatedAt,
});

module.exports = experienceTransformer;
