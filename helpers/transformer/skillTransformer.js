const human = require("human-time");

const skillTransformer = ({ _id, skill, createdAt, updatedAt }) => {
  return {
    _id,
    skill,
    postedAtHuman: human(createdAt),
    createdAt,
    updatedAt,
  };
};

module.exports = skillTransformer;
