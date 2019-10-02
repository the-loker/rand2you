const mailer   = require('nodemailer');
const pug      = require('pug');
const path     = require('path');

switch(process.env.MAIL_TRANSPOTER) {
    case 'gmail':

        var transporter = mailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        });

        break;

    case 'sparkpost':

        break;
}

const sendMail = options => new Promise((resolve, reject) => {

    transporter.sendMail(options, (err, info) => {

        if(err) return reject(err);

        resolve(info);

    });

});

exports.send = options => new Promise((resolve, reject) => {

    let data = options.data || {};
    let template = options.template;

    delete options.data;
    delete options.temlpate;

    if(!template) {
        return reject(new Error('Не указан шаблон Email сообщения.'));
    }

    let file = path.join(process.cwd(), '/views/mail', template + '.pug');

    pug.renderFile(file, data, (err, html) => {

        if(err) return reject(err);

        options.html = html;

        sendMail(options).then(resolve).catch(reject);

    });

});