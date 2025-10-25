import { Router } from "express";
import {
  toggleVideoLike,
  toggleCommentLike,
  toggleTweetLike,
  getLikedVideos
} from "../controllers/like.controller.js"; 

import { verifyjwt } from "../middlewares/auth.middlewares.js";


const router = Router();
router.use(verifyjwt);

router.route("/toggle/v/:videoId").post(toggleVideoLike);
router.route("/toggle/c/:commentId").post(toggleCommentLike);
router.route("/toggle/t/:tweetId").post(toggleTweetLike);
router.route("/videos").get(getLikedVideos);



export default router;