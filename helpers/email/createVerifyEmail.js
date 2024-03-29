const { BASE_HTTPS_URL } = process.env;

const createVerifyEmail = (email, verificationCode) => ({
  to: email,
  subject: "Prolink email Verification",
  html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Please activate your account</title>
  <!--[if mso]><style type="text/css">body, table, td, a { font-family: Arial, Helvetica, sans-serif !important; }</style><![endif]-->
</head>

<body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #ffffff;">
  <table role="presentation"
    style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; background-color: #D3E3FD;">
    <tbody>
      <tr>
        <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
          <table role="presentation" style="max-width: 600px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
            <tbody>
              <tr>
                <td style="padding: 40px 0px 0px;">
                  <div style="text-align: right;">
                    <div style="padding-bottom: 20px;"><img
                        src="https://res.cloudinary.com/dpglma1ap/image/upload/v1694954100/login-logo_mmngu6.png"So Yummy"
                        style="width: 80px; border-radius=20%;"></div>
                  </div>
                  <div style="padding: 20px; background-color: #F5F5F5;">
                    <div style="color: rgb(25, 26, 20); text-align: left;">
                      <h1 style="margin: 1rem 0">Final step...</h1>
                      <p style="padding-bottom: 16px">Follow this link to verify your email address.</p>
                      <p style="padding-bottom: 16px"><a target="_blank" href="${BASE_HTTPS_URL}/auth/verify/${verificationCode}"
                          style="padding: 12px 24px; border-radius: 4px; color: #FFF; background: #2977C9;display: inline-block;margin: 0.5rem 0;">Confirm
                          now</a></p>
                      <p style="padding-bottom: 16px">If you didn’t ask to verify this address, you can ignore this email.</p>
                      <p style="padding-bottom: 16px">Thanks,<br>The Prolink team</p>
                    </div>
                  </div>
                  <div style="padding-top: 20px; color: #2977C9; text-align: center;">
                    <p style="padding-bottom: 16px">Please enjoy communication in our community ♥</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>

</html>`,
});

module.exports = createVerifyEmail;
