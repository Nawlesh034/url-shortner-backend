import express from "express"
import { createShort, getAllUrl, getStats, deleteLink, getUrl } from "../controllers/url_controller.js"

const router = express.Router()

// API routes for links
router.post("/links", createShort)           // POST /api/v1/links - Create link
router.get("/links", getAllUrl)              // GET /api/v1/links - List all links
router.get("/links/:code", getStats)         // GET /api/v1/links/:code - Stats for one code
router.delete("/links/:code", deleteLink)    // DELETE /api/v1/links/:code - Delete link

// Redirect route (this will be handled in main server file)
// GET /:code - Redirect (handled in index.js)

export default router