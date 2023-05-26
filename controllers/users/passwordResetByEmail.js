const { User } = require("../../models");

const uuid = require("uuid");

const { sendEmail } = require("../../helpers");
const { createRestorePasswordEmail } = require("../../helpers");
const { HttpError } = require("../../routes/errors/HttpErrors");

const passwordResetByEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    throw HttpError(404, "User not found");
  }

  if (!user.verify) {
    throw HttpError(401, "User not verify");
  }

  const resetToken = uuid.v4();

  // Сохранение токена сброса пароля и установка времени истечения срока действия токена
  user.resetToken = resetToken;
  user.resetTokenExpires = Date.now() + 3600000; // 1 час
  await user.save();

  const restorePassEmail = createRestorePasswordEmail(email, resetToken);
  await sendEmail(restorePassEmail);

  res.status(201).json({
    status: "succes",
    message: "Reset link have been sent to your email.",
  });
};

module.exports = passwordResetByEmail;

// Пользователь может получить электронное письмо с токеном сброса пароля и перейти по
// специальной ссылке, чтобы подтвердить свою личность и задать новый пароль.
// После перехода по ссылке, вы можете иметь эндпоинт для проверки токена
// сброса пароля и позволить пользователю задать новый пароль.Это позволяет обеспечить
// безопасность, так как сам пароль не передается через электронную почту.
