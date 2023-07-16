const { Schema, model } = require("mongoose");
const Joi = require("joi");

const mongooseErrorHandler = require("../helpers/utils/handleMongooseError");

const emailRegexp = /^\w+([-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;

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
    other1: {
      type: String,
      default: "",
    },
    other2: {
      type: String,
      default: "",
    },
    other3: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    avatarURL: { type: Schema.Types.ObjectId, ref: "MediaFile", default: null },
    verify: {
      type: Boolean,
      default: false,
    },
    subscription: [{ type: Schema.Types.ObjectId, ref: "User" }],
    favorite: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
    token: [{ type: Schema.Types.ObjectId, ref: "Token" }],
    // token: {
    //   type: String,
    //   default: "",
    // },
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
    experience: [{ type: Schema.Types.ObjectId, ref: "Experience" }],
    education: [{ type: Schema.Types.ObjectId, ref: "Education" }],
    languages: [{ type: Schema.Types.ObjectId, ref: "Language" }],
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

const userUpdateSchema = Joi.object({
  name: Joi.string(),
  surname: Joi.string(),
  phone: Joi.string().allow(""),
  site: Joi.string().allow(""),
  other1: Joi.string().allow(""),
  other2: Joi.string().allow(""),
  other3: Joi.string().allow(""),
  avatarURL: Joi.string().allow(""),
  about: Joi.string().allow(""),
  headLine: Joi.string().allow(""),
  frame: Joi.string().valid("Original", "Open to work", "Hiring"),
})
  .or("name", "surname", "phone", "site", "other1", "other2", "other3", "avatarURL", "about", "headLine", "frame")
  .required();

const userSchemas = {
  registerSchema,
  emailSchema,
  loginSchema,
  subscribeSchema,
  passwordChangeSchema,
  passwordResetRequestSchema,
  passwordRestoreSchema,
  userUpdateSchema,
};

const User = model("User", userSchema);

module.exports = {
  User,
  userSchemas,
};
