const express = require("express")
const { authentication } = require("../middleware/userHandler")
require("dotenv").config()
const authorizeRole = require('../middleware/roleAuthorization');
const upload = require("../middleware/upload");

const auth = require("../controllers/auth")
const proposalController = require("../controllers/proposal");

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


// proposal
// Ketua membuat proposal
router.post(
    "/proposal",
    authentication,
    authorizeRole("mahasiswa", "dosen"),
    upload.single("file"),
    proposalController.createProposal
  );
  
  // Ketua invite anggota
  router.post(
    "/proposal/:proposalId/invite",
    authentication,
    authorizeRole("mahasiswa", "dosen"),
    proposalController.inviteMember
  );
  
  // Anggota respond
  router.post(
    "/proposal/:proposalId/respond",
    authentication,
    authorizeRole("mahasiswa", "dosen"),
    proposalController.respondInvite
  );
  
  // Admin review proposal
  router.post(
    "/proposal/:proposalId/review",
    authentication,
    authorizeRole("admin"),
    proposalController.adminReviewProposal
  );

  // list my invites
  router.get('/invites/my', authentication, authorizeRole('mahasiswa','dosen'), proposalController.getMyInvites);
  



module.exports = router