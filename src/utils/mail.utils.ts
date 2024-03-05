import nodemailer from "nodemailer"
import env from "../configs/envs"

const MAIL = env.MAIL
const MAIL_PASS = env.MAIL_PASS

export default async function sendMail(
  to: string,
  subject: string,
  text: string,
  type: "verification" | "payment_success",
  username?: string,
  verifyUrl?: string
) {
  const transporter = nodemailer.createTransport({
    host: "server2.ahost.cloud",
    port: 465,
    secure: true,
    auth: {
      user: MAIL,
      pass: MAIL_PASS,
    },
  })

  const mailOptions: nodemailer.SendMailOptions = {
    from: {
      name:
        type === "verification"
          ? "SBG Verification"
          : "Payment received successfully",
      address: MAIL,
    },
    to,
    subject,
    text,
    html:
      type === "verification"
        ? verificatonHtml(username!, verifyUrl!)
        : paymentSuccessHtml(),
  }

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error)
    } else {
      console.log("Email sent:", info.response)
    }
  })
}

function paymentSuccessHtml() {
  return `<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0;" />
    <meta name="format-detection" content="telephone=no" />

    <style>
      /* Reset styles */
      body {
        margin: 0;
        padding: 0;
        min-width: 100%;
        width: 100% !important;
        height: 100% !important;
      }

      body,
      table,
      td,
      div,
      p,
      a {
        -webkit-font-smoothing: antialiased;
        text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
        line-height: 100%;
      }

      table,
      td {
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        border-collapse: collapse !important;
        border-spacing: 0;
      }

      img {
        border: 0;
        line-height: 100%;
        outline: none;
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
      }

      #outlook a {
        padding: 0;
      }

      .ReadMsgBody {
        width: 100%;
      }

      .ExternalClass {
        width: 100%;
      }

      .ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {
        line-height: 100%;
      }

      @media all and (min-width: 560px) {
        body {
          margin-top: 30px;
        }
      }

      /* Rounded corners */
      @media all and (min-width: 560px) {
        .container {
          border-radius: 8px;
          -webkit-border-radius: 8px;
          -moz-border-radius: 8px;
          -khtml-border-radius: 8px;
        }
      }
      /* Links */
      a,
      a:hover {
        color: #127db3;
      }

      .footer a,
      .footer a:hover {
        color: #999999;
      }
    </style>

    <!-- MESSAGE SUBJECT -->
    <title>Confirm email template</title>
  </head>

  <!-- BODY -->
  <body
    topmargin="0"
    rightmargin="0"
    bottommargin="0"
    leftmargin="0"
    marginwidth="0"
    marginheight="0"
    width="100%"
    style="
      border-collapse: collapse;
      border-spacing: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      -webkit-font-smoothing: antialiased;
      text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
      line-height: 100%;
      background-color: #18191d;
      color: #fff;
    "
    bgcolor="#18191d"
    text="#000000"
  >
    <table
      width="100%"
      align="center"
      border="0"
      cellpadding="0"
      cellspacing="0"
      style="
        border-collapse: collapse;
        border-spacing: 0;
        margin: 0;
        padding: 0;
        width: 100%;
      "
      class="background"
    >
      <tr>
        <td
          align="center"
          valign="top"
          style="
            border-collapse: collapse;
            border-spacing: 0;
            margin: 0;
            padding: 0;
          "
          bgcolor="#18191d"
        >
          <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            align="center"
            bgcolor="#111215"
            width="560"
            style="
              border-collapse: collapse;
              border-spacing: 0;
              padding: 0;
              width: inherit;
              max-width: 560px;
              color: #ffffff;
            "
            class="container"
          >
            <tr>
              <td
                align="center"
                valign="top"
                style="
                  border-collapse: collapse;
                  border-spacing: 0;
                  margin: 0;
                  padding: 0;
                  padding-left: 6.25%;
                  padding-right: 6.25%;
                  width: 87.5%;
                  font-size: 24px;
                  font-weight: bold;
                  line-height: 130%;
                  padding-top: 25px;
                  color: #fff;
                  font-family: sans-serif;
                "
                class="header"
              >
                <img
                  border="0"
                  vspace="0"
                  hspace="0"
                  src="data:image/png;base64,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"
                  width="100"
                  alt="Logo"
                  title="Logo"
                />
              </td>
            </tr>
            <tr>
              <td
                align="center"
                valign="top"
                style="
                  border-collapse: collapse;
                  border-spacing: 0;
                  margin: 0;
                  padding: 0;
                  padding-left: 6.25%;
                  padding-right: 6.25%;
                  width: 87.5%;
                  padding-top: 25px;
                "
                class="line"
              >
                <hr
                  color="#E0E0E0"
                  align="center"
                  width="100%"
                  size="1"
                  noshade
                  style="margin: 0; padding: 0"
                />
              </td>
            </tr>
            <tr>
              <td
                align="center"
                valign="top"
                style="
                  border-collapse: collapse;
                  border-spacing: 0;
                  margin: 0;
                  padding: 0;
                  padding-left: 6.25%;
                  padding-right: 6.25%;
                  width: 87.5%;
                  font-size: 17px;
                  font-weight: 400;
                  line-height: 160%;
                  padding-top: 25px;
                  color: #fff;
                  font-family: sans-serif;
                "
                class="paragraph"
              >
                <span style="font-size: 20px; font-weight: bold"
                  >Your payment has been received
                </span>
                <br />
                You will have access to the courses for 30 days
              </td>
            </tr>

            <tr>
              <td
                align="center"
                valign="top"
                style="
                  border-collapse: collapse;
                  border-spacing: 0;
                  margin: 0;
                  padding: 0;
                  padding-left: 6.25%;
                  padding-right: 6.25%;
                  width: 87.5%;
                  padding-top: 25px;
                "
                class="line"
              >
                <hr
                  color="#E0E0E0"
                  align="center"
                  width="100%"
                  size="1"
                  noshade
                  style="margin: 0; padding: 0"
                />
              </td>
            </tr>
            <tr>
              <td
                align="center"
                valign="top"
                style="
                  border-collapse: collapse;
                  border-spacing: 0;
                  margin: 0;
                  padding: 0;
                  padding-left: 6.25%;
                  padding-right: 6.25%;
                  width: 87.5%;
                  font-size: 17px;
                  font-weight: 400;
                  line-height: 160%;
                  padding-top: 20px;
                  padding-bottom: 25px;
                  color: #fff;
                  font-family: sans-serif;
                "
                class="paragraph"
              ></td>
            </tr>
          </table>
          <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            align="center"
            width="560"
            style="
              border-collapse: collapse;
              border-spacing: 0;
              background: #18191d;
              padding: 0;
              width: inherit;
              max-width: 560px;
            "
            class="wrapper"
          >
            <tr>
              <td
                align="center"
                valign="top"
                style="
                  border-collapse: collapse;
                  border-spacing: 0;
                  margin: 0;
                  padding: 0;
                  padding-left: 6.25%;
                  padding-right: 6.25%;
                  width: 87.5%;
                  font-size: 13px;
                  font-weight: 400;
                  line-height: 150%;
                  padding-top: 20px;
                  padding-bottom: 20px;
                  color: #999999;
                  font-family: sans-serif;
                "
                class="footer"
              >
                Check out our extensive
                <a
                  href="https://admin-qa.dideea.com/"
                  target="_blank"
                  style="
                    text-decoration: underline;
                    color: #999999;
                    font-family: sans-serif;
                    font-size: 13px;
                    font-weight: 400;
                    line-height: 150%;
                  "
                  >FAQ</a
                >
                for more information or contact us through our
                <a
                  href="https://admin-qa.dideea.com/"
                  target="_blank"
                  style="
                    text-decoration: underline;
                    color: #999999;
                    font-family: sans-serif;
                    font-size: 13px;
                    font-weight: 400;
                    line-height: 150%;
                  "
                  >Contact Form</a
                >. Our support team is available to help you 24 hours a day,
                seven days a week.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`
}

function verificatonHtml(name: string, verifyUrl: string) {
  if (!name || !verifyUrl) return

  return `<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
    <meta http-equiv="content-type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0;" />
    <meta name="format-detection" content="telephone=no" />

    <style>
      /* Reset styles */
      body {
        margin: 0;
        padding: 0;
        min-width: 100%;
        width: 100% !important;
        height: 100% !important;
      }

      body,
      table,
      td,
      div,
      p,
      a {
        -webkit-font-smoothing: antialiased;
        text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
        line-height: 100%;
      }

      table,
      td {
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
        border-collapse: collapse !important;
        border-spacing: 0;
      }

      img {
        border: 0;
        line-height: 100%;
        outline: none;
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
      }

      #outlook a {
        padding: 0;
      }

      .ReadMsgBody {
        width: 100%;
      }

      .ExternalClass {
        width: 100%;
      }

      .ExternalClass,
      .ExternalClass p,
      .ExternalClass span,
      .ExternalClass font,
      .ExternalClass td,
      .ExternalClass div {
        line-height: 100%;
      }

      @media all and (min-width: 560px) {
        body {
          margin-top: 30px;
        }
      }

      /* Rounded corners */
      @media all and (min-width: 560px) {
        .container {
          border-radius: 8px;
          -webkit-border-radius: 8px;
          -moz-border-radius: 8px;
          -khtml-border-radius: 8px;
        }
      }
      /* Links */
      a,
      a:hover {
        color: #127db3;
      }

      .footer a,
      .footer a:hover {
        color: #999999;
      }
    </style>

    <!-- MESSAGE SUBJECT -->
    <title>Confirm email template</title>
  </head>

  <!-- BODY -->
  <body
    topmargin="0"
    rightmargin="0"
    bottommargin="0"
    leftmargin="0"
    marginwidth="0"
    marginheight="0"
    width="100%"
    style="
      border-collapse: collapse;
      border-spacing: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      -webkit-font-smoothing: antialiased;
      text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
      line-height: 100%;
      background-color: #18191d;
      color: #fff;
    "
    bgcolor="#18191d"
    text="#000000"
  >
    <table
      width="100%"
      align="center"
      border="0"
      cellpadding="0"
      cellspacing="0"
      style="
        border-collapse: collapse;
        border-spacing: 0;
        margin: 0;
        padding: 0;
        width: 100%;
      "
      class="background"
    >
      <tr>
        <td
          align="center"
          valign="top"
          style="
            border-collapse: collapse;
            border-spacing: 0;
            margin: 0;
            padding: 0;
          "
          bgcolor="#18191d"
        >
          <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            align="center"
            bgcolor="#111215"
            width="560"
            style="
              border-collapse: collapse;
              border-spacing: 0;
              padding: 0;
              width: inherit;
              max-width: 560px;
              color: #ffffff;
            "
            class="container"
          >
            <tr>
              <td
                align="center"
                valign="top"
                style="
                  border-collapse: collapse;
                  border-spacing: 0;
                  margin: 0;
                  padding: 0;
                  padding-left: 6.25%;
                  padding-right: 6.25%;
                  width: 87.5%;
                  font-size: 24px;
                  font-weight: bold;
                  line-height: 130%;
                  padding-top: 25px;
                  color: #fff;
                  font-family: sans-serif;
                "
                class="header"
              >
                <img
                  border="0"
                  vspace="0"
                  hspace="0"
                  src="data:image/png;base64,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"
                  width="100"
                  alt="Logo"
                  title="Logo"
                />
              </td>
            </tr>
            <tr>
              <td
                align="center"
                valign="top"
                style="
                  border-collapse: collapse;
                  border-spacing: 0;
                  margin: 0;
                  padding: 0;
                  padding-left: 6.25%;
                  padding-right: 6.25%;
                  width: 87.5%;
                  padding-top: 25px;
                "
                class="line"
              >
                <hr
                  color="#E0E0E0"
                  align="center"
                  width="100%"
                  size="1"
                  noshade
                  style="margin: 0; padding: 0"
                />
              </td>
            </tr>
            <tr>
              <td
                align="center"
                valign="top"
                style="
                  border-collapse: collapse;
                  border-spacing: 0;
                  margin: 0;
                  padding: 0;
                  padding-left: 6.25%;
                  padding-right: 6.25%;
                  width: 87.5%;
                  font-size: 17px;
                  font-weight: 400;
                  line-height: 160%;
                  padding-top: 25px;
                  color: #fff;
                  font-family: sans-serif;
                "
                class="paragraph"
              >
                Hi ${name},<br />
                In order to start using your new account, you need to confirm
                your email address.
              </td>
            </tr>
            <tr>
              <td
                align="center"
                valign="top"
                style="
                  border-collapse: collapse;
                  border-spacing: 0;
                  margin: 0;
                  padding: 0;
                  padding-left: 6.25%;
                  padding-right: 6.25%;
                  width: 87.5%;
                  padding-top: 25px;
                  padding-bottom: 5px;
                "
                class="button"
              >
                <a
                  href="${verifyUrl}"
                  target="_blank"
                  style="text-decoration: underline"
                >
                  <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    align="center"
                    style="
                      max-width: 240px;
                      min-width: 120px;
                      border-collapse: collapse;
                      border-spacing: 0;
                      padding: 0;
                    "
                  >
                    <tr>
                      <td
                        align="center"
                        valign="middle"
                        style="
                          padding: 12px 24px;
                          margin: 0;
                          text-decoration: underline;
                          border-collapse: collapse;
                          border-spacing: 0;
                          border-radius: 4px;
                          -webkit-border-radius: 4px;
                          -moz-border-radius: 4px;
                          -khtml-border-radius: 4px;
                        "
                        bgcolor="#3969d5"
                      >
                        <a
                          target="_blank"
                          style="
                            text-decoration: underline;
                            color: #ffffff;
                            font-family: sans-serif;
                            font-size: 17px;
                            font-weight: 400;
                            line-height: 120%;
                          "
                          href="${verifyUrl}"
                        >
                          Verify Email Address
                        </a>
                      </td>
                    </tr>
                  </table>
                </a>
              </td>
            </tr>
            <tr>
              <td
                align="center"
                valign="top"
                style="
                  border-collapse: collapse;
                  border-spacing: 0;
                  margin: 0;
                  padding: 0;
                  padding-left: 6.25%;
                  padding-right: 6.25%;
                  width: 87.5%;
                  padding-top: 25px;
                "
                class="line"
              >
                <hr
                  color="#E0E0E0"
                  align="center"
                  width="100%"
                  size="1"
                  noshade
                  style="margin: 0; padding: 0"
                />
              </td>
            </tr>
            <tr>
              <td
                align="center"
                valign="top"
                style="
                  border-collapse: collapse;
                  border-spacing: 0;
                  margin: 0;
                  padding: 0;
                  padding-left: 6.25%;
                  padding-right: 6.25%;
                  width: 87.5%;
                  font-size: 17px;
                  font-weight: 400;
                  line-height: 160%;
                  padding-top: 20px;
                  padding-bottom: 25px;
                  color: #fff;
                  font-family: sans-serif;
                "
                class="paragraph"
              >
                If you did not sign up for this account you can ignore this
                email and the account will be deleted.
              </td>
            </tr>
          </table>
          <table
            border="0"
            cellpadding="0"
            cellspacing="0"
            align="center"
            width="560"
            style="
              border-collapse: collapse;
              border-spacing: 0;
              background: #18191d;
              padding: 0;
              width: inherit;
              max-width: 560px;
            "
            class="wrapper"
          >
            <tr>
              <td
                align="center"
                valign="top"
                style="
                  border-collapse: collapse;
                  border-spacing: 0;
                  margin: 0;
                  padding: 0;
                  padding-left: 6.25%;
                  padding-right: 6.25%;
                  width: 87.5%;
                  font-size: 13px;
                  font-weight: 400;
                  line-height: 150%;
                  padding-top: 20px;
                  padding-bottom: 20px;
                  color: #999999;
                  font-family: sans-serif;
                "
                class="footer"
              >
                Check out our extensive
                <a
                  href="https://admin-qa.dideea.com/"
                  target="_blank"
                  style="
                    text-decoration: underline;
                    color: #999999;
                    font-family: sans-serif;
                    font-size: 13px;
                    font-weight: 400;
                    line-height: 150%;
                  "
                  >FAQ</a
                >
                for more information or contact us through our
                <a
                  href="https://admin-qa.dideea.com/"
                  target="_blank"
                  style="
                    text-decoration: underline;
                    color: #999999;
                    font-family: sans-serif;
                    font-size: 13px;
                    font-weight: 400;
                    line-height: 150%;
                  "
                  >Contact Form</a
                >. Our support team is available to help you 24 hours a day,
                seven days a week.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`
}
