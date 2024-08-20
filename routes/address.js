const express = require("express");
const AddressRoute = express.Router();
const userAuth = require("../middleware/userAuth");
const {
  addAddress,
  getAddressByUser,
  setdefault,
  webaddAddress,
  deleteAddress,
  updateAddress,
} = require("../controller/address");

AddressRoute.post("/addAddress", userAuth, addAddress);
AddressRoute.get("/getAddressByUser", userAuth, getAddressByUser);
AddressRoute.patch("/setdefault", userAuth, setdefault);
AddressRoute.patch("/updateAddress", userAuth, updateAddress);
AddressRoute.delete("/deleteAddress/:addressId", userAuth, deleteAddress);
//WEBSITE
AddressRoute.post("/web/addAddress", webaddAddress);

module.exports = AddressRoute;
