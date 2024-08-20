const Product = require("../models/product");
const PrimaryCategory = require("../models/primaryCategory");
const SecondaryCategory = require("../models/secondaryCategory");
const TertiaryCategory = require("../models/tertiaryCategory");
const OrderHistory = require("../models/ordersHistory");
const User = require("../models/user");
const WishList = require("../models/addWishList");
const ordersHistory = require("../models/ordersHistory");

exports.addProduct = async (req, res) => {
  try {
    const { primaryCategoryId } = req.body;
    const { userId } = req.user;

    if (!primaryCategoryId) {
      return res
        .status(400)
        .json({ success: false, message: "Please select a parent category." });
    }

    const secondaryCategoryId = req.body.secondaryCategoryId || null;
    const tertiaryCategoryId = req.body.tertiaryCategoryId || null;
    // console.log("____", secondaryCategoryId, tertiaryCategoryId);
    if (!req.files) {
      return res.status(400).json({
        success: false,
        message: "You must select at least one image to continue.",
      });
    }
    let productImages = req.files.map((img, index) => {
      const color = Array.isArray(req.body.color)
        ? req.body.color[index]
        : null;
      return { imgUrl: img.location, color: color };
    });
    // console.log(productImages);
    const dataToSave = {
      ...req.body,
      createdBy: userId,
      primaryCategoryId,
      secondaryCategoryId,
      tertiaryCategoryId,
      imageColors: productImages,
    };
    // Create a new product if no id is provided
    const newProduct = new Product(dataToSave);
    const savedProduct = await newProduct.save();
    return res.status(200).json({
      success: true,
      message: "Product added successfully",
      data: savedProduct,
    });
  } catch (err) {
    console.log(err);
    let customError = {
      statusCode: err.statusCode || 505,
      message: err.message || "Something went wrong, try again later",
    };
    if (err.name === "ValidationError") {
      customError.message = Object.values(err.errors)
        .map((item) => item.message)
        .join(",");
      customError.statusCode = 400;
    }
    return res
      .status(customError.statusCode)
      .json({ status: false, message: customError.message });
  }
};

exports.getProductByPrimaryCategory = async (req, res) => {
  try {
    const { primaryCategoryId } = req.params;
    const check = await PrimaryCategory.findById(primaryCategoryId).select(
      "-quantity"
    );
    if (!check) {
      return res
        .status(400)
        .json({ success: false, message: "Primary category not found" });
    }
    const secondaryCategory = await SecondaryCategory.find({
      primaryCategoryId,
      permanentDeleted: false,
    });
    const product = await Product.find({
      primaryCategoryId,
      permanentDeleted: false,
    });

    let result = {};
    if (secondaryCategory.length !== 0) {
      result.secondaryCategory = secondaryCategory;
      // return res.status(400).json({ success: false, data: secondaryCategory });
    } else if (product.length !== 0) {
      result.product = product;
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Nothing to display" });
    }

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getProductbySecondary = async (req, res) => {
  try {
    const { secondaryCategoryId } = req.params;
    const check = await SecondaryCategory.findById(secondaryCategoryId);
    if (!check) {
      return res
        .status(400)
        .json({ success: false, message: "No Secondary Category found" });
    }
    const tertiaryCategory = await TertiaryCategory.find({
      secondaryCategoryId,
      permanentDeleted: false,
    });
    const product = await Product.find({
      secondaryCategoryId,
      permanentDeleted: false,
    });
    let result = {};
    if (tertiaryCategory.length > 0) {
      result.tertiaryCategory = tertiaryCategory;
    } else if (product.length > 0) {
      result.product = product;
    } else {
      return res
        .status(200)
        .json({ success: false, message: "Nothing to display" });
    }
    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getProductByTertiay = async (req, res) => {
  try {
    const { tertiaryCategoryId } = req.params;
    const check = await Product.findById(tertiaryCategoryId);
    if (!check) {
      return res
        .status(404)
        .json({ success: false, message: "tertiary category not found" });
    }
    const product = await Product.find({
      tertiaryCategoryId,
      permanentDeleted: false,
    });
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getonSale = async (req, res) => {
  try {
    const { onSale } = req.params;
    const product = await Product.find({
      onSale: true,
      permanentDeleted: false,
    });
    if (product.length === 0) {
      return res.status(200).json({ success: false, data: product });
    } else {
      return res.status(200).json({ success: true, data: product });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.priceRange = async (req, res) => {
  try {
    const min = req.query.min;
    const max = req.query.max;
    if (!req.query) {
      return res
        .status(400)
        .json({ success: false, message: "Please select a valid price range" });
    }
    const product = await Product.find({
      price: { $gte: min, $lte: max },
      permanentDeleted: false,
    });
    if (product.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: " NO product found" });
    }
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

// exports.buyProduct = async (req, res) => {
//   try {
//     const { items, shippingDetails } = req.body;
//     // const { userId } = req.user;
//     const productIds = items.map((item) => item.productId);
//     // console.log(req.body);
//     const products = await Product.find({
//       _id: { $in: productIds },
//       permanentDeleted: false,
//     });
//     // console.log(products);
//     if (products.length !== productIds.length) {
//       return res
//         .status(404)
//         .json({ success: false, message: "less no of products" });
//     }
//     let totalPrice = 0;
//     for (let i = 0; i < items.length; i++) {
//       const item = items[i];
//       const product = products.find((p) => p._id.equals(item.productId));
//       if (product.quantity < item.quantity) {
//         return res
//           .status(404)
//           .json({ success: false, message: "Product is out of stock" });
//       }
//       product.quantity -= item.quantity;
//       product.numSales += item.quantity;
//       totalPrice += product.price * item.quantity;
//       await product.save();
//     }
//     const order = await OrderHistory.create({
//       //  userId,
//       items,
//       shippingDetails,
//       totalPrice,
//     });

//     return res.status(200).json({
//       success: true,
//       data: order,
//       message: "Order Placed Successfully",
//     });
//   } catch (error) {
//     console.log(error);
//     return res.status(400).json({ success: false, message: error.message });
//   }
// };

exports.getLatestProduct = async (req, res) => {
  try {
    const product = await Product.find({ permanentDeleted: false }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.searchApi = async (req, res) => {
  try {
    const search = req.query.search;
    // console.log(search);
    if (search) {
      let data = await Product.find({
        $or: [
          { productName: new RegExp(search, "i"), permanentDeleted: false },
        ],
      });
      if (data.length === 0) {
        return res
          .status(400)
          .json({ success: false, message: "OOPS! No Product Found" });
      }
      return res
        .status(200)
        .json({ success: true, count: data.length, data: data });
    } else if (search === " ") {
      return res
        .status(404)
        .json({ success: false, message: "OOPS! No Product Found" });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.addToFave = async (req, res) => {
  try {
    const userId = req.user;
    const { productId } = req.params;
    await User.findOneAndUpdate(
      { _id: userId, permanentDeleted: false },
      { $addToSet: { favProduct: productId } }
    );
    return res
      .status(200)
      .json({ success: true, message: "Successfully added to favourite" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.isFeatured = async (req, res) => {
  try {
    const check = await Product.find({
      isFeatured: true,
      permanentDeleted: false,
    });
    if (check.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Nothing featured yet." });
    }
    return res.status(200).json({ success: true, data: check });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.newArrival = async (req, res) => {
  try {
    const product = await Product.find({
      new: true,
      permanentDeleted: false,
    });
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

//>>>>>>>>>>>>>New<<<<<<<<<<<||

exports.topSales = async (req, res) => {
  try {
    const Topsale = await Product.find({ permanentDeleted: false }).sort({
      numSales: -1,
    });
    return res.status(200).json({ success: true, data: Topsale });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getProductByFr = async (req, res) => {
  try {
    const { categoryId } = req.params;
    // console.log(categoryId);
    const product = await Product.find({
      $or: [
        { primaryCategoryId: { $eq: categoryId } },
        { secondaryCategoryId: { $eq: categoryId } },
        { tertiaryCategoryId: { $eq: categoryId } },
      ],
      permanentDeleted: false,
    });
    console.log(product);
    if (product.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Category Not Found" });
    }
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const getAllProducts = await Product.find({
      permanentDeleted: false,
    })
      .populate("primaryCategoryId")
      .populate("secondaryCategoryId")
      .populate("tertiaryCategoryId");
    return res.status(200).json({ success: true, data: getAllProducts });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId)
      .populate("primaryCategoryId")
      .populate("secondaryCategoryId")
      .populate("tertiaryCategoryId")
      .populate("createdBy");
    if (!product) {
      return res
        .status(400)
        .json({ success: false, message: "No Product Found" });
    }
    return res.status(200).json({ success: true, data: product });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.addToWishList = async (req, res) => {
  try {
    const { productId } = req.body;
    console.log(req.body);
    const { userId } = req.user;
    // console.log(req.user);
    const check = await Product.findById(productId);
    if (!check) {
      return res
        .status(400)
        .json({ success: false, message: "No Product Found" });
    }
    const find = await WishList.findOne({ userId, productId });
    if (find) {
      await WishList.findOneAndRemove({ _id: find._id });
      return res.status(200).json({
        success: true,
        message: "Product has been removed from wishlist",
      });
    }

    const wishlist = await WishList.create({
      userId,
      productId,
    });

    return res
      .status(200)
      .json({ success: true, message: "Product has been addded to wishlist" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getwishlist = async (req, res) => {
  try {
    const { userId } = req.user;
    // console.log(req.user);
    const wishlist = await WishList.find({ userId }).populate("productId");
    const data = wishlist.map((product) => ({
      wishlistId: product._id,
      productData: product.productId,
    }));
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.removeWishList = async (req, res) => {
  try {
    const { userId } = req.user;
    const { wishlistId } = req.body;
    console.log(req.body, req.user);
    const wishlist = await WishList.findOneAndRemove({ _id: wishlistId });
    console.log(wishlist);
    if (!wishlist) {
      return res
        .status(400)
        .json({ success: false, message: "No Product Found" });
    }
    return res.status(200).json({
      success: true,
      message: "Product has been deleted form your wishList",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getOrderHistory = async (req, res) => {
  try {
    const { userId } = req.user;
    const check = await OrderHistory.find({ userId }).populate(
      "items.productId"
    );

    console.log(check);

    if (!check) {
      return res
        .status(400)
        .json({ success: true, message: "OH You didn't Order any thing yet" });
    }

    return res.status(200).json({ success: true, OrderHistory: check });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * Buy Product App
 */
exports.buyProductApp = async (req, res) => {
  try {
    const { userId } = req.user;
    const { items, shippingDetails, totalPrice } = req.body;
    // console.log("Items: ", items);
    // console.log("TotalPrice: ", totalPrice);
    // console.log(req.body);
    if (!items || items.length === 0 || !shippingDetails) {
      return res
        .status(400)
        .json({ success: false, message: "Please Provide All Fields" });
    }

    // const productIds = items.map((item) => item.productId);
    // const variationIds = items.map((item) => item.variationId);
    // console.log("Product Ids: ", productIds);
    // console.log("Variation Ids: ", variationIds);

    // const products = await Product.find({
    //   _id: { $in: productIds },
    // });

    // const filteredProducts = products.map((product) =>
    //   product.imageColors
    //     .map((variation) => variationIds.includes(variation.id))
    //     .filter((founded) => founded == true)
    // );
    // console.log("Filtered Products: ", filteredProducts);
    // const filteredProductsCount = filteredProducts.reduce(
    //   (count, currentFilteredProduct) => {
    //     return (count += currentFilteredProduct.length);
    //   },
    //   0
    // );

    // console.log("Filtered Products Count: ", filteredProductsCount);

    // console.log(`filteredProductsCount - ${filteredProductsCount}`);
    // console.log(`product.length - ${products.length}`);

    // const products = await Product.find({
    //   "imageColors._id": { $in: productIds },
    // });

    // console.log("ProductIdsssssssssssss", productIds);
    // console.log("productsssssssssssssss", products);

    /** Old Code */
    // if (products.length !== productIds.length) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Mismatch in the number of products",
    //   });
    // }

    /** Updated Code */
    // if (variationIds.length !== filteredProductsCount) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Mismatch in the number of products",
    //   });
    // }
    // let totalPrice = 0; // Initialize totalPrice outside the loop

    // for (let i = 0; i < items.length; i++) {
    //   const item = items[i];
    //   const product = products.find((p) => p._id.equals(item.productId));
    //   // console.log("Price>>>>>", item.price);
    //   // console.log("Quantity>>>>>", item.quantity);
    //   if (product.quantity < parseInt(item.quantity)) {
    //     return res
    //       .status(404)
    //       .json({ success: false, message: "Product is out of stock" });
    //   }
    //   product.quantity -= parseInt(item.quantity);
    //   product.numSales += parseInt(item.quantity);
    //   // totalPrice += product.price * parseInt(item.quantity);
    //   // console.log("totalPrice>>>>>", totalPrice);
    //   await product.save();
    // }
    const productIds = items.map((item) => item.productId);
    const productNames = await Promise.all(
      productIds.map(async (productId) => {
        const product = await Product.findById(productId);
        return product.productName; // Assuming product has a 'name' property
      })
    );
    const subTotal = parseInt(totalPrice) - 200;

    const order = await OrderHistory.create({
      userId,
      productNames,
      items,
      shippingDetails,
      totalPrice,
      subTotal,
    });

    return res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const check = await Product.findOne({
      _id: productId,
      permanentDeleted: false,
    });
    if (!check) {
      return res
        .status(400)
        .json({ success: false, message: "No product Found" });
    }
    await Product.findOneAndUpdate(
      { _id: productId },
      { permanentDeleted: true },
      {
        new: true,
      }
    );
    return res
      .status(200)
      .json({ success: true, message: "Product has been deleted" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const data = await OrderHistory.find({})
      .populate({ path: "items.productId", select: "productName" })
      .populate({ path: "userId", select: "firstName lastName" })
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await OrderHistory.findById(orderId);
    if (!order) {
      return res.status(400).json({
        success: false,
        message: `No order found by this id:${orderId}`,
      });
    }
    const { status } = req.body;
    if (!["Pending", "Confirmed", "Delivered", "Cancelled"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value.",
      });
    }
    const updated = await ordersHistory.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    return res.status(200).json({ success: true, data: updated });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteOrderHistory = async (req, res) => {
  try {
    const { userId } = req.user;
    console.log("useridddddddddddddddddd", req.user);
    const isClear = await ordersHistory.deleteMany({ userId });

    if (!isClear) {
      console.log("There is no any order!");
      return res.status(400).json({
        success: false,
        message: `There is no any order`,
      });
    }
    console.log("order history clear successfully");
    return res.status(200).json({
      success: true,
      message: "History clear successfully...",
    });
    // const { orderId } = req.params;
    // const order = await OrderHistory.findById(orderId);
    // if (!order) {
    //   return res.status(400).json({
    //     success: false,
    //     message: `No order found by this id:${orderId}`,
    //   });
    // }
    // await ordersHistory.findByIdAndRemove(orderId);
    // return res.status(200).json({ success: true, message: "History cleared" });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.updateProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    console.log("idddddddddddddddddddddddd: ", productId);
    const check = await Product.findById(productId);
    if (!check) {
      return res
        .status(400)
        .json({ success: false, message: "No Product Found" });
    }
    const {
      productName,
      primaryCategoryId,
      secondaryCategoryId,
      tertiaryCategoryId,
      price,
      isFeatured,
      description,
      quantity,
      numSales,
      isSlider,
      status,
      onSale,
      discountedPrice,
    } = req.body;

    console.log("Update Product: ", req.body);
    console.log("Body Data for UpdateProduct: ", req.body);
    console.log(req.files);
    if (req.files) {
      let productImages = [];

      if (Array.isArray(req.files)) {
        productImages = req.files.map((img, index) => ({
          imgUrl: img.location,
          color: Array.isArray(req.body.color) ? req.body.color[index] : null,
        }));
      } else {
        productImages.push({
          imgUrl: req.files[0].location,
          color: req.body.color,
        });
      }
      console.log(productImages);
      if (discountedPrice > price) {
        return res.status(400).json({
          success: false,
          message: "Discounted price must b less then actual price",
        });
      }
      const product = await Product.findOneAndUpdate(
        { _id: productId, permanentDeleted: false },
        {
          productName,
          primaryCategoryId,
          ...(secondaryCategoryId && { secondaryCategoryId }),
          ...(tertiaryCategoryId && { tertiaryCategoryId }),
          price,
          isFeatured,
          description,
          quantity,
          numSales,
          isSlider,
          status,
          imageColors: productImages,
          onSale,
          discountedPrice,
        },
        {
          new: true,
        }
      );

      if (!product) {
        return res
          .status(400)
          .json({ success: false, message: "No Product Found" });
      }

      return res
        .status(200)
        .json({ success: true, message: "Updated...", data: product });
    } else {
      const product = await Product.findOneAndUpdate(
        { productId, permanentDeleted: false },
        {
          productName,
          primaryCategoryId,
          secondaryCategoryId,
          tertiaryCategoryId,
          price,
          isFeatured,
          description,
          quantity,
          numSales,
          isSlider,
          status,
          onSale,
          discountedPrice,
        },
        {
          new: true,
        }
      );

      if (!product) {
        return res
          .status(400)
          .json({ success: false, message: "No Product Found" });
      }

      return res
        .status(200)
        .json({ success: true, message: "Updated...", data: product });
    }
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.filter = async (req, res) => {
  try {
    const { minPrice, maxPrice } = req.body;
    console.log(req.body);

    const filter = {
      permanentDeleted: false,
    };

    if (minPrice !== "" && maxPrice !== "") {
      filter.price = { $gte: minPrice, $lte: maxPrice };
    } else if (minPrice !== "") {
      filter.price = { $gte: minPrice };
    } else if (maxPrice !== "") {
      filter.price = { $lte: maxPrice };
    }

    const products = await Product.find(filter);

    console.log(products);
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.getRelatedProducts = async (req, res) => {
  try {
    const productId = req.params.productId;
    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const allProducts = await Product.find({
      _id: { $ne: productId },
      primaryCategoryId: product.primaryCategoryId,
      permanentDeleted: false,
    })
      .populate("primaryCategoryId")
      .populate("secondaryCategoryId")
      .populate("tertiaryCategoryId");

    return res.status(200).json({ success: true, data: allProducts });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ success: false, message: error.message });
  }
};

exports.bestSelling = async (req, res) => {
  try {
    const products = await Product.find({ permanentDeleted: false })
      .sort({ numSales: -1 })
      .limit(2);
    console.log(products);
    if (!products) {
      return res
        .status(400)
        .json({ success: false, message: "No Product Found" });
    }
    return res.status(200).json({ success: true, data: products });
  } catch (error) {
    return res.status(400).json({ success: false, data: error.message });
  }
};

exports.getAllPayments = async (req, res) => {
  try {
    const allProductsOfOrderhistory = await ordersHistory
      .find({})
      .populate("items.productId");
    const data = allProductsOfOrderhistory.map((user) => {
      let obj = { ...user.shippingDetails };
      obj["totalprice"] = user.totalPrice;
      return obj;
    });
    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
