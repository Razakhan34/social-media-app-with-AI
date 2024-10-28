const express = require("express");

const postController = require("../controller/postController");
const { authUser } = require("../middleware/auth");

const router = express.Router();

router.route("/").post(authUser, postController.createPost);

router.get("/followingPosts", authUser, postController.getAllPostsOfFollowing);
router
  .route("/:id")
  .get(authUser, postController.likeAndDislikePost)
  .patch(authUser, postController.updateCaption)
  .delete(authUser, postController.deletePost);

router
  .route("/comments/:postId")
  .patch(authUser, postController.commentOnPost)
  .delete(authUser, postController.deleteComment);

module.exports = router;
