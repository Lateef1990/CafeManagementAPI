const express = require('express');
const connection = require('../connection');
const router = express.Router();
const auth = require('../Services/authentication');
const checkRole = require('../Services/checkRoles');

// Api to Add New Product
router.post('/AddProduct', auth.authenticateToken, checkRole.checkRole,(req, res)=>{
     const product = req.body;
     query = "insert into product (name,CategoryId,description,price,status) values(?,?,?,?,'true')";
     connection.query(query,[product.name,product.CategoryId,product.description,product.price,product.status], (err, results)=>{
          if(!err){
               return res.status(200).json({message:"Successfully Added a new Product"});
          }
          else{
               return res.status(500).json(err)
          }
     })
});

// Appi to fetch all the product
router.get('/FetchAllProduct', auth.authenticateToken,(req,res, next)=>{
     const query = "select p.prodId,p.name,p.descrption,p.price,p.status, c.id as categoryId,c.name as categoryName from product as p INNER JOIN category as c where p.categoryId =c.catId";
     connection.query(query,(err, results)=>{
          if(!err){
               return res.status(200).json(results);
          }
          else{
               return res.status(500).json(err);
          }
     })
});

//Api to get product by category
router.get('/getByCategory', auth.authenticateToken,(req, res, next)=>{
     const id = req.params.id;
     qury = "select prodId, name, from product where ProdId=?  and status='true'";
     connection.query(query,[id], (err,results)=>{
          if(!err){
               return res.status(200).json(results);
          }
          else{
               return res.status(500).json(err);
          }
     })
});

// Api to get product
router.get('/getProductById', auth.authenticateToken,(req,res, next)=>{
     const id = req.params.id;
     query = "select id,name,description,price from product where ProdId=?";
     connection.query(query,[id], (err,results)=>{
          if(!err){
               return res.status(200).json(results[0]);
          }
          else{
               return res.status(500).json(err);
          }
     })
}); 

// Api t Update Product

router.patch('/UpdateProduct', auth.authenticateToken, checkRole.checkRole, (req,res, next)=>{
          const product = req.body;
          query = "update product set name=?, description=?, price=? where ProdId=?";
          connection.query(query,[product.name,product.description,product.price],(err, results)=>{
               if(!err){
                    if(results.affectedRows == 0){
                         return res.status(404).json({message:"Product id does not found"});
                    }
                    return res.status(200).json({message:"Product Updated Successfully"});
               }
               else{
                    return res.status(500).json(err);
               }
          })
});

// Api to delete product
router.delete('/deleteProduct/:id', auth.authenticateToken,checkRole.checkRole,(req, res, next)=>{
     const id = req.params.id;
     query = "delete from product where ProdId=?";
     connection.query(query,[id],(err, results)=>{
          if(!err){
               if(results.affectedRows == 0){
                return  res.status(404).json({message:"Product id does not found"});  
               }
               return res.status(200).json({message:"The Product is deleted Succesfully"})
          }
          else{
               res.status(500).json(err);
          }
     })
});

// Api to update Product statuss
router.patch('/UpdateStatus', auth.authenticateToken,checkRole.checkRole,(req,res,next)=>{
     const user = req.body;
     query ="update product set status=? where ProdId=?";
     connection.query(query,[user.status,user.id],(err,resultss)=>{
          if(!err){
               if(results.affectedRows == 0){
                return  res.status(404).json({message:"Product id does not found"});  
               }
               return res.status(200).json({message:"The Product status is Updated Succesfully"})
          }
          else{
               return res.status(500).json(err);
          }
     })
})

module.exports = router;
