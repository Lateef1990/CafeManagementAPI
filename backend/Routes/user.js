const express = require('express')
const connection = require('../connection')
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config;
const auth = require('../Services/authentication')
const checkRole = require('../Services/checkRoles');

// Api for user to sign up
router.post('/signup', (req, res) => {
     const user = req.body;
     query = "select email, password, role, status from user where email =?";
     connection.query(query, [user.email], (err, results) => {
          if (!err) {
               if (results.length <= 0) {
                    query = "insert into user(name,contactNumber,email,password,status,role) values(?,?,?,?,'false','user')"
                    connection.query(query, [user.name, user.contactNumber, user.email, user.password], (err, result) => {
                         if (!err) {
                              return res.status(200).json({ message: "Successfully registered" })
                         }
                         else {
                              return res.json(500).json(err)
                         }
                    })
               } else {
                    return res.status(400).json({ message: "Email already exist" })
               }
          }
          else {
               return res.json(500).json(err);
          }
     })

});

// Api for Login
router.post('/login', (req, res) => {
     const user = req.body;
     query = "select email,password,role,status from user where email=?"
     connection.query(query, [user.email], (err, results) => {
          if (!err) {
               if (results.length <= 0 || results[0].password != user.password) {
                    return res.status(401).json({ message: "Incorrect Username or Password" })
               }
               else if (results[0].status === 'false') {
                    return res.status(401).json({ message: "Wait for the Admin Approval" })
               }
               else if (results[0].password === user.password) {
                    const response = { email: results[0].email, role: results[0].role }
                    const accessToken = jwt.sign(response, process.env.ACCESS_TOKEN, { expiresIn: '2h' });
                    res.status(200).json({ token: accessToken });
               }
               else {
                    return res.status(400).json({ message: "Something Went Wrong, Please try again later" })
               }
          }
          else {
               return res.status(500).json(err);
          }
     })
});

const transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD
     }
})
// APi for forget password
router.post('/forgotPassword', (req, res) => {
     const user = req.body;
     query = "select email, password from user where email=?";
     connection.query(query, [user.email], (err, results) => {
          if (!err) {
               if (results.length <= 0) {
                    return res.status(200).json({ message: "Email Provided does not exist" });
               } else {
                    var mailOptions = {
                         from: process.env.EMAIL,
                         to: results[0].email,
                         subject: 'Password by Cafe Management System',
                         html: '<p><b>Your Login details for Cafe Management System</b><br><b>Email:</b>' + results[0].email + '<br><br><b>Password:</b>' + results[0].password + '<br><a href="">Click here to Login</a></p>'
                    };
                    transporter.sendMail(mailOptions, function (error, info) {
                         if (error) {
                              console.log(error);
                         } else {
                              console.log('Email sent:' + info.response)
                         }
                    });
                    return res.status(200).json({ message: "Password sent successfully to your email" });
               }
          } else {
               return res.status(500).json({ error: "An internal server error occurred" });
          }
     })
});

// Api to get all users
router.get('/getAllUser', auth.authenticateToken, checkRole.checkRole, (req, res) => {
     const query = "select userid,name,contactNumber,status, from user where roles='user'";
     connection.query(query, (err, results) => {
          if (!err) {
               return res.status(200).json(results)
          } else {
               return res.status(500).json(err);
          }
     })
})

// Api to update User
router.patch('/UpdateUserStatus', auth.authenticateToken, checkRole.checkRole, (req, res) => {
     const user = req.body;
     const query = "update user set status=? where id=?";
     connection.query(query, [user.status, user.id], (err, results) => {
          if (!err) {
               if (results.affectedRows == 0) {
                    return res.status(404).json({ message: "User Id does not exist" });
               }
               return res.status(200).json({ message: "User updated Successfully" })
          } else {
               return res.status(500).json(err);
          }
     })
});

// Api to checkToken
router.get('/CheckToken', auth.authenticateToken, (req, res) => {
     return res.status(200).json({ message: "true" });
});

// Api to change password
router.post("/ChangeUserPassword",auth.authenticateToken, (req, res) => {
     const user = req.body;
     const email = res.locals.email;
     const query = 'select * from user where email=? and password=?';
     connection.query(query, [email, user.oldPassword], (err, results) => {
          if (!err) {
               if (results.length <= 0) {
                    return res.status(200).json({ message: "Incoerrect old Password" })
               }
               else if (results[0].password == user.oldPassword) {
                    query = "update user set password where email=?";
                    connection.query(query, [user.newPassword, email], (err, results) => {
                         if (!err) {
                              return res.status(200).json({ message: "Password Updated Succesfully" })
                         }
                         else {
                              return res.status(500).json(err);
                         }
                    })
               }
               else {
                    return res.status(400).json({ message: "Something Went Wrong. Please try again later" })
               }
          } else {
               return res.status(500).json(err)
          }
     })
});



module.exports = router;