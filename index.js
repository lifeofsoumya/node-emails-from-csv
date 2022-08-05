const express = require("express");
const nodemailer = require("nodemailer");
const { parse } = require('csv-parse');
const path = require("path");
const bodyParser = require("body-parser");
const fs = require('fs');
require("dotenv").config();

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());
// app.use(express.urlencoded({extended:true}));

app.use(express.static("public")); // uses public folder for static files

// reading csv file

const csvRecords = [];
const csvEmails = [];
const emailColIndexInCSV = 2;   // based on the data in your csv file
const nameColIndexInCSV = 1;   // based on the data in your csv file
const sourceCSVFile = path.join(__dirname, './files/test.csv');


// sending mail

function sendMail() {
    const mailTransporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        auth: {
            type: "login",
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
        rejectUnauthorized: false
        }
});

let mailDetails = {
    from: process.env.GID,
    to: 'mondalsoumya2001@gmail.com',
    bcc: csvEmails,
    subject: `Welcome to Exposys Data Labs`,
    html: "<h1> Hi There, greetings from Exposys </h1>"
    // content to added into the mail
};

mailTransporter.sendMail(mailDetails, function(err, data) {
    if (err) {
        console.log("Error Occurs " + err);
    } else {
        console.log("Email sent successfully");
    }
});
}

const startExecution = async () => {
    await readCSVFile()
    await sendMail();
}


const readCSVFile = () => {
        fs.createReadStream(sourceCSVFile)
            .pipe(parse())
            .on('data', (data) => {
                csvRecords.push(data);
            })
            .on('end', () => {
                for(const csvRecord of csvRecords){
                    csvEmails.push(csvRecord[1]);
                }
                // console.log(csvRecords) // whole data
                console.log(csvEmails) // only email
            });
            
}


startExecution();

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`server started at port ${port}`);
});
