const express = require("express")
const { authentication, isStaff } = require("../middleware/userHandler")
require("dotenv").config()
const authorizeRole = require('../middleware/roleAuthorization');

const auth = require("../controllers/auth")

const router = express.Router()


// GET Home Page
router.get("/", (req, res) => {
    res.send("API SIDATA")
})

// Authentication
router.post("/auth/register", auth.register)
router.post("/auth/login", auth.login)
router.get("/auth/me", authentication, auth.getCurrentUser)
router.get("/auth/logout", authentication, auth.logout)

module.exports = router