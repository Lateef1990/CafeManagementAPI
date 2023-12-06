const express = require('express');
const connection = require('../connection')
const router = express.Router();
const ejs = require('ejs');
const pdf = require('html-pdf');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid');
const auth = require('../Services/authentication');

router.post('/generateReport', auth.authenticateToken, (req, res) => {
     const generateuid = uuid.v1();
     const orderDetails = req.body;
     var productdetailReport = json.parse(orderDetails.productDetails);

     query = "insert into bill (name,uuid,email,contactNumber,paymentMethod,total,productDetais,createdBy) values(?,?,?,?,?,?,?,?)";
     connection.query(query, [orderDetails.name, generateuid, orderDetails.email, orderDetails.contactNumber, orderDetails.paymentMethod, orderDetails.total, orderDetails.productDetails, res.locals.email], (err, results) => {
          if (err) {
               ejs.renderFile(path.join(__dirname, '', "report.ejs"), { productDetails: productdetailReport, name: orderDetails.name, email: orderDetails.email, contactNumber: orderDetails.contactNumber, paymentMethod: orderDetails.paymentMethod, totalAmount: orderDetails.totalAmount }, (err, results) => {
                    if (err) {
                         return res.status(500).json(err);
                    }
                    else {
                         pdf.create(results).toFile('./generated_pdf/' + generateuid + ".pdf", function (err, data) {
                              if (err) {
                                   console.log(err);
                                   return res.status(500).json(err);
                              }
                              else {
                                   return res.status(200).json({ uuid: generateuid });
                              }
                         })
                    }
               });
          }
          else {
               return res.status(500).json(err);
          }
     })
});

// Api to get pdf
router.post('/getpdf',auth.authenticateToken,function(req, res){
     const orderDetails = req.body;
     const pdfPath = './generated_pdf/'+orderDetails.uuid+'.pdf';
     if(fs.existsSync(pdfPath)){
          res.contentType('application/pdf');
          fs.createReadStream(pdfPath).pipe(res);
     }
     else{
          const productdetailReport = JSON.parse(orderDetails.productDetails);
          if (err) {
               ejs.renderFile(path.join(__dirname, '', "report.ejs"), { productDetails: productdetailReport, name: orderDetails.name, email: orderDetails.email, contactNumber: orderDetails.contactNumber, paymentMethod: orderDetails.paymentMethod, totalAmount: orderDetails.totalAmount }, (err, results) => {
                    if (err) {
                         return res.status(500).json(err);
                    }
                    else {
                         pdf.create(results).toFile('./generated_pdf/' + orderDetails.uuid + ".pdf", function (err, data) {
                              if (err) {
                                   console.log(err);
                                   return res.status(500).json(err);
                              }
                              else {
                                   res.contentType('application/pdf');
                                   fs.createReadStream(pdfPath).pipe(res);
                              }
                         })
                    }
               });
          }
     }
});

// Api to display Bill
router.get('/getBill',auth.authenticateToken,(req, res)=>{
     query = 'select * from bill order by id DESC';
     connection.query(query,(err, results)=>{
          if(!err){
               return res.status(200).json(results);
          }
          else{
               return res.status(500).json(500);
          }
     })
});

// Api to delete bill
router.delete('/deleteBil/:id', auth.authenticateToken,(req,res)=>{
     const id = req.params.id;
     query = "delete from bill where id=?";
     connection.query(query,[id], (req, res)=>{
          if(!err){
               if(results.affectedRows ==0){
                    return res.status(404).json({message:"The Bill Id does not found"});
               }
               return res.status(200).json({message:"Bill is Deleted Succesfully"});
          }
          else{
               return res.status(500).json(err);
          }
     })
})


module.exports = router;
