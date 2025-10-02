import Product from "../model/Product.js";
import { isAdmin } from "./userContarallers.js";

export function createProduct (req,res){

    if(!isAdmin(req)){
        res.status(401).json({
            message:"frobidden"
        })
        return
    }

   

    const product = new Product(req.body)

    product.save().then(
        ()=>{
            res.json({
                message: "product save succesflly"

            })
        }
    )

}



export function getAllProducts(req, res) {
  // If user admin → get all products
  if (req.user && req.user.role === "admin") {
    Product.find()
      .then((products) => {
        res.json(products);
      })
      .catch((err) => {
        res.status(500).json({ message: "Error fetching products", error: err.message });
      });
  } else {
    // Guest or normal user → only available products
    Product.find({ isAvailable: true })
      .then((products) => {
        res.json(products);
      })
      .catch((err) => {
        res.status(500).json({ message: "Error fetching products", error: err.message });
      });
  }
}

// DELETE /products/:productId
export function deleteProduct(req,res){
    if(!isAdmin(req)){
        res.status(403).json({
            message : "Only admin can delete products"
        })
        return
    }

    const productID = req.params.productID

    Product.deleteOne({productID : productID}).then(
        ()=>{
            res.json({
                message : "Product deleted successfully"
            })
        }
    )
}



// export function updateProduct(req,res){
//     if(!isAdmin(req)){
//         res.status(403).json({
//             message : "Only admin can update products"
//         })
//         return
//     }

//     const productID = req.params.productID

//     Product.updateOne({productID : productID}, req.body).then(
//         ()=>{
//             res.json({
//                 message : "Product updated successfully"
//             })
//         }
//     )
// }




export function updateProduct(req, res) {
  // 1. Check admin first
  if (!isAdmin(req)) {
    res.status(403).json({ message: "Only admin can update products" });
    return;
  }

  // 2. Get productId from URL parameter
  const productId = req.params.productId; // notice lowercase d here

  // 3. Update using mongoose
  Product.updateOne({ productId: productId }, req.body)
    .then((result) => {
      if (result.matchedCount === 0) {
        res.status(404).json({ message: "Product not found" });
      } else {
        res.json({ message: "Product updated successfully" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Error updating product" });
    });
}


export function getProductById(req, res) {
  const productId = req.params.productId; // from URL

  Product.findOne({ productId: productId })
    .then((product) => {
      if (!product) {
        res.status(404).json({ message: "Product not found" });
      } else {
        res.json(product);
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: "Error fetching product" });
    });
}
