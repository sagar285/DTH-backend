const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, message) => {
          try {
                    const transporter = nodemailer.createTransport({
                              service: "gmail",
                              port: 587,
                              secure: false,
                              auth: {
                                        user: process.env.EMAIL_USER,
                                        pass: process.env.EMAIL_PASS
                              }
                    });

                    await transporter.sendMail({
                              from: process.env.EMAIL_USER,
                              to,
                              subject,
                              text: message
                    });

                    console.log("📧 Email sent successfully");
                    return true;
          } catch (error) {
                    console.error("Email Error: ", error);
                    return false;
          }
};

module.exports = sendEmail;
