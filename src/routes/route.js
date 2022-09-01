const express = require("express");
const router = express.Router(); //used express to create route handlers
const userController = require("../controller/userController")
const userProfileController = require("../controller/ProfileController")
const mid = require("../middleware/auth")

router.post("/login", userController.login)

router.post("/signup", userController.signup)

router.post("/userProfile", userProfileController.userProfile)

router.get("/getList", userProfileController.getList)
//router.get("/editProfile", userProfileController.editProfile)
router.put("/editProfile", mid.auth, userProfileController.editProfile)


module.exports = router