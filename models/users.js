const { Schema, model } = require("mongoose");
const Joi = require("joi");

const mongooseErrorHandler = require("../helpers/utils/handleMongooseError");

const emailRegexp = /^\w+([-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

const experienceSchema = Schema({
  companyName: {
    type: String,
    required: true,
  },
  employmentType: {
    type: String,
    enum: ["Full-time", "Part-time", "Self-employed", "Freelance", "Contract", "Internship", "Apprenticeship"],
    default: "Full-time",
  },
  position: {
    type: String,
    default: "",
  },
  location: {
    type: String,
    default: "",
  },
  locationType: {
    type: String,
    enum: ["On-site", "Hybrid", "Remote"],
    default: "On-site",
  },
  startDate: {
    type: Date,
    default: "",
  },
  endDate: {
    type: Date,
    default: "",
  },
  skills: {
    type: Array,
    default: [{ type: Schema.Types.ObjectId, ref: "Posts" }],
  },
  mediaFiles: {
    type: Array,
    default: [{ type: Schema.Types.ObjectId, ref: "MediaFile" }],
  },
});

const educationSchema = Schema({
  school: {
    type: String,
    required: true,
  },
  degree: {
    type: String,
    default: "",
  },
  fieldOfStudy: {
    type: String,
    default: "",
  },
  startDate: {
    type: Date,
    default: "",
  },
  endDate: {
    type: Date,
    default: "",
  },
  grade: {
    type: String,
    default: "",
  },
  activitiesAndSocieties: {
    type: String,
    default: "",
  },
  Description: {
    type: String,
    default: "",
  },
  skills: {
    type: Array,
    default: [{ type: Schema.Types.ObjectId, ref: "Posts" }],
  },
  mediaFiles: {
    type: Array,
    default: [{ type: Schema.Types.ObjectId, ref: "MediaFile" }],
  },
});
const languageSchema = Schema({
  language: {
    type: String,
    required: true,
  },
  level: {
    type: String,
    required: true,
    enum: [
      "Elementary proficiency",
      "Limited working proficiency",
      "Professional working proficiency",
      "Full professional proficiency",
      "Native or bilingual proficiency",
    ],
    default: "Elementary proficiency",
  },
});

const userSchema = Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: emailRegexp,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      unique: true,
      default: "",
    },
    site: {
      type: String,
      default: "",
    },
    other_1: {
      type: String,
      default: "",
    },
    other_2: {
      type: String,
      default: "",
    },
    other_3: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    avatarURL: {
      type: String,
      default: "",
    },
    verify: {
      type: Boolean,
      default: false,
    },
    subscription: {
      type: Boolean,
      default: false,
    },
    favorite: {
      type: Array,
      default: [{ type: Schema.Types.ObjectId, ref: "Posts" }],
    },
    posts: {
      type: Array,
      default: [{ type: Schema.Types.ObjectId, ref: "Posts" }],
    },
    token: {
      type: String,
      default: "",
    },
    verificationCode: {
      type: String,
      default: "",
    },
    resetToken: {
      type: String,
      default: "",
    },
    about: {
      type: String,
      default: "",
    },
    experience: {
      type: [experienceSchema],
      default: [],
    },
    education: {
      type: [educationSchema],
      default: [],
    },
    languages: {
      type: [languageSchema],
      default: [],
    },
    headLine: {
      type: String,
      default: "",
    },
    frame: {
      type: String,
      enum: ["Original", "Open to work", "Hiring"],
      default: "Original",
    },
  },
  { versionKey: false, timestamps: true }
);

userSchema.post("save", mongooseErrorHandler);

const registerSchema = Joi.object({
  name: Joi.string().required(),
  surname: Joi.string().required(),
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const emailSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().min(6).required(),
});

const subscribeSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

const passwordChangeSchema = Joi.object({
  oldPassword: Joi.string().min(6).required(),
  newPassword: Joi.string().min(6).required(),
});

const passwordResetRequestSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
});

const passwordRestoreSchema = Joi.object({
  password: Joi.string().min(6).required(),
});

const userSchemas = {
  registerSchema,
  emailSchema,
  loginSchema,
  subscribeSchema,
  passwordChangeSchema,
  passwordResetRequestSchema,
  passwordRestoreSchema,
};

const User = model("User", userSchema);

module.exports = {
  User,
  userSchemas,
};

// const ss = {
//   CompanyName: "MakeUp",
//   EmploymentType: "Full-time",
//   Position: "Manager",
//   Location: "Ukraine, Kiev",
//   LocationType: "On-site",
//   StartDate: {},
//   EndDate: {},
//   skills: [{}],
//   mediafile: {},
// };
// https://www.npmjs.com/package/react-flatpickr
// https://solod-s.github.io/goit-js-hw-09/02-timer.html
// https://solod-s.github.io/goit-js-hw-10/
