const human = require("human-time");

const jobTransformer = ({
  title,
  location,
  description,
  employmentType,
  seniorityLevel,
  industry,
  applyURL,
  skills,
  applied,
  owner,
  _id,
  createdAt,
  updatedAt,
}) => ({
  _id,
  title,
  location,
  description,
  employmentType,
  seniorityLevel,
  industry,
  applyURL,
  skills,
  applied,
  postedAtHuman: human(createdAt),
  createdAt,
  updatedAt,
  owner,
});

module.exports = jobTransformer;
