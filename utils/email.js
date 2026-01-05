const nodemailer = require('nodemailer');
const { htmlToText } = require('html-to-text');
const pug = require('pug');

// new Email(user, url).sendWelcome();
module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.firstName = user.name.split(' ')[0];
        this.url = url;
        this.from = `Harshul Goswami <${process.env.EMAIL_FROM}>`;
    }

    newTransport() {
        if (process.env.NODE_ENV === 'production') {
            //use sendgrid
            return nodemailer.createTransport({
                service : 'SendGrid',
                auth: {
                user: process.env.SENDGRID_USERNAME,
                pass: process.env.SENDGRID_PASSWORD
            } 
            })
        }

        return nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    }

    //send the actual mail
    async send(template, subject) {
        //1) render html based on the pug template
        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`, {
            firstName: this.firstName,
            url: this.url,
            subject
        });

        //2) define email options
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText(html)  //use html-to-text package method
        }

        //3) create a transport and send email
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
        await this.send('welcome', 'welcome to the natours family!');
    }

    async sendPasswordReset(){
        await this.send('passwordReset', 'Your password reset token (valid only for 10 minutes)');
    }
};