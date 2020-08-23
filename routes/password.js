const express = require('express');
const hbs = require('nodemailer-express-handlebars');
const nodemailer = require('nodemailer');
const path = require('path');

const email = process.env.EMAIL;
const password = process.env.PASSWORD;

const smtpTransport = nodemailer.createTransport({
  service: process.env.EMAIL_PROVIDER,
  auth: {
      user: email,
      pass: password,
  },
  tls: {
        rejectUnauthorized: false
    }
});

  const handlebarsOptions = {
    viewEngine: {
      extName: '.hbs',
      defaultLayout: null,
      partialsDir: './templates/',
      layoutsDir: './templates/'
    },
    viewPath: path.resolve('./templates/'),
    extName: '.html',
  };

  smtpTransport.use('compile', hbs(handlebarsOptions));

const router = express.Router();


router.post('/forgot-password', async (request, response) => {
  if (!request.body || !request.body.email) {
    response.status(400).json({message:'invalid body', status: 400});
  } else {
    const userEmail = request.body.email;

      //send user password reset email
      const emailOptions = {
          to: userEmail,
          from: email,
          template: 'forgot-password',
          subject: 'SNT MMO Password Reset',
          context: {
            name: 'joe',
            url: 'http://localhost:${process.env.PORT || 3000}'

          },
      };
      await smtpTransport.sendMail(emailOptions);

  response.status(200).json({ message:`Please check your emails for a reset link. The link will be valid for the next ten minutes`, status: 200});
}
});

router.post('/reset-password', async (request, response) => {
  if (!request.body || !request.body.email) {
    response.status(400).json({message:'invalid body', status: 400});
  } else {
        const userEmail = request.body.email;

        //send user password update email
        const emailOptions = {
            to: userEmail,
            from: email,
            template: 'reset-password',
            subject: 'SNT MMO Password Reset Successful',
            context: {
              name: 'joe',

            },
        };
        await smtpTransport.sendMail(emailOptions);


  response.status(200).json({ message:`Password succesfully updated. Gratz`, status: 200});
}
});

module.exports = router;
