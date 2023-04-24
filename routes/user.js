const router = require("express").Router();
const multer = require("multer");

const upload = multer({ dest: "upload/" });

const { createUser, getDocuments } = require("../controllers/user");

router.route("/user").post(createUser);
router.route("/docs/:email").get(getDocuments);
module.exports = router;
