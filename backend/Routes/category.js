const express = require('express');
const connection = require('../connection');
const router = express.Router();
const auth = require('../Services/authentication');
const checkRole = require('../Services/checkRoles');


// APi to add new product category
router.post('/Addcategory', auth.authenticateToken, checkRole.checkRole, (req, res, next)=>{
     const category = req.body;
     query = "insert into category (name) values(?)";
     connection.query(query,[category.name],(err, results)=>{
          if(!err){
               return res.status(200).json({message:"category is added Successfully"});
          }
          else{
               return res.status(500).json(err);
          }
     })
});

// Api to fatch all the types of product category
router.get('/FetchAllCategory', auth.authenticateToken, (req, res, next)=>{
     const query = 'select * from category order by name';
     connection.query(query,(err, results)=>{
          if(!err){
               return res.status(200).json(results);
          }
          else {
               return res.status(500).json(err);
          }
     })

});

// APi to Update the category
router.patch('/UpdateCategory', auth.authenticateToken, checkRole.checkRole, (req, res, next)=>{
     const product = req.body;
     const query = 'update category set name=? where id=?';
     connection.query(query,[product.name, product.id], (err, results)=>{
          if(!err){
               if(results.affectedRows ==0){
                    return res.status(404).json({message:"Category id does not founded"});
               }
               return res.status(200).json({message:"Category Updated Successfully"});
          }
          else{
               return res.status(500).json(err);
          }
     })
});