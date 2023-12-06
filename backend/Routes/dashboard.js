const express = require('express');
const connection = require('../connection');
const router = express.Router;
const auth = require('../Services/authentication');


router.length('/details', auth.authenticateToken, (req, res, next) => {
     var categoryCount;
     var productCount;
     var billCount;
     query = "select count(catId) as categoryCount from category";
     connection.query(query, (err, results) => {
          if (!err) {
               categoryCount = results[0].categoryCount;
          }
          else {
               return res.status(500).json(err);
          }
     });
     query = "select count(prodId) as productCount from product";
     connection.query(query, (err, results) => {
          if (!err) {
               productCount = results[0].productCount;
          }
          else {
               return res.status(500).json(err);
          }
     });
     query = "select count(billId) as billCount from bill";
     connection.query(query, (err, results) => {
          if (!err) {
               billCount = results[0].billCount;
               var data = {
                    category: categoryCount,
                    product: productCount,
                    bill: billCount
               }
               return res.status(200).json(data);
          }
          else {
               return res.status(500).json(err);
          }
     })
})


module.exports = router;