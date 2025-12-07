// import Product from "../model/Product.js";
// import { isAdmin } from "./userContarallers.js";

// export function createProduct (req,res){

//     if(!isAdmin(req)){
//         res.status(401).json({
//             message:"frobidden"
//         })
//         return
//     }

   

//     const product = new Product(req.body)

//     product.save().then(
//         ()=>{
//             res.json({
//                 message: "product save succesflly"

//             })
//         }
//     )

// }



// export function getAllProducts(req, res) {
//   // If user admin → get all products
//   if (req.user && req.user.role === "admin") {
//     Product.find()
//       .then((products) => {
//         res.json(products);
//       })
//       .catch((err) => {
//         res.status(500).json({ message: "Error fetching products", error: err.message });
//       });
//   } else {
//     // Guest or normal user → only available products
//     Product.find({ isAvailable: true })
//       .then((products) => {
//         res.json(products);
//       })
//       .catch((err) => {
//         res.status(500).json({ message: "Error fetching products", error: err.message });
//       });
//   }
// }



// export function deleteProduct(req, res) {
//   if (!isAdmin(req)) {
//     return res.status(403).json({
//       message: "Only admin can delete products"
//     });
//   }

//   const productId = req.params.productId; // ✅ matches route exactly

//   Product.findByIdAndDelete(productId)
//     .then((deletedProduct) => {
//       if (!deletedProduct) {
//         return res.status(404).json({
//           message: "Product not found"
//         });
//       }
//       res.json({
//         message: "Product deleted successfully"
//       });
//     })
//     .catch((err) => {
//       res.status(500).json({
//         message: "Error deleting product",
//         error: err.message
//       });
//     });
// }






// export function updateProduct(req, res) {
//   // 1. Check admin first
//   if (!isAdmin(req)) {
//     res.status(403).json({ message: "Only admin can update products" });
//     return;
//   }

//   // 2. Get productId from URL parameter
//   const productId = req.params.productId; // notice lowercase d here

//   // 3. Update using mongoose
//   Product.updateOne({ productId: productId }, req.body)
//     .then((result) => {
//       if (result.matchedCount === 0) {
//         res.status(404).json({ message: "Product not found" });
//       } else {
//         res.json({ message: "Product updated successfully" });
//       }
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).json({ message: "Error updating product" });
//     });
// }


// export function getProductById(req, res) {
//   const productId = req.params.productId; // from URL

//   Product.findOne({ productId: productId })
//     .then((product) => {
//       if (!product) {
//         res.status(404).json({ message: "Product not found" });
//       } else {
//         res.json(product);
//       }
//     })
//     .catch((err) => {
//       console.error(err);
//       res.status(500).json({ message: "Error fetching product" });
//     });
// }


import Product from "../model/Product.js";
import { isAdmin } from "./userContarallers.js";

/* ---------------------- CREATE PRODUCT ---------------------- */
export function createProduct(req, res) {
  if (!isAdmin(req)) {
    return res.status(401).json({ message: "Forbidden" });
  }

  const newProduct = new Product({
    ...req.body,
    imageUrls: req.body.imageUrls || [], // ⭐ multiple images support
  });

  newProduct
    .save()
    .then(() => res.json({ message: "Product saved successfully" }))
    .catch((err) =>
      res
        .status(500)
        .json({ message: "Error saving product", error: err.message })
    );
}

/*  GET ALL PRODUCTS */
export function getAllProducts(req, res) {
  // Admin → show all
  if (req.user && req.user.role === "admin") {
    Product.find()
      .then((products) => res.json(products))
      .catch((err) =>
        res
          .status(500)
          .json({ message: "Error fetching products", error: err.message })
      );
  } else {
    // User → only available products
    Product.find({ isAvailable: true })
      .then((products) => res.json(products))
      .catch((err) =>
        res
          .status(500)
          .json({ message: "Error fetching products", error: err.message })
      );
  }
}

/* ---------------------- GET PRODUCT BY ID ---------------------- */
export function getProductById(req, res) {
  const productId = req.params.productId;

  Product.findOne({ productId: productId })
    .then((product) => {
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    })
    .catch((err) =>
      res.status(500).json({ message: "Error fetching product", error: err.message })
    );
}

/* ---------------------- DELETE PRODUCT ---------------------- */
export function deleteProduct(req, res) {
  if (!isAdmin(req)) {
    return res.status(403).json({ message: "Only admin can delete products" });
  }

  const id = req.params.productId; // this is MongoDB _id, not productId

  Product.findByIdAndDelete(id)
    .then((deleted) => {
      if (!deleted) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product deleted successfully" });
    })
    .catch((err) =>
      res
        .status(500)
        .json({ message: "Error deleting product", error: err.message })
    );
}

/* UPDATE PRODUCT*/
export function updateProduct(req, res) {
  if (!isAdmin(req)) {
    return res.status(403).json({ message: "Only admin can update products" });
  }

  const productId = req.params.productId;

  // $set ensures even imageUrls array updates correctly
  Product.updateOne({ productId: productId }, { $set: req.body })
    .then((result) => {
      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json({ message: "Product updated successfully" });
    })
    .catch((err) =>
      res
        .status(500)
        .json({ message: "Error updating product", error: err.message })
    );
}
