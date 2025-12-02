import express from "express"
import cors from "cors"
import router from "./routers/router.js"
import { connectDb } from "./config/db.js";
import { getUrl } from "./controllers/url_controller.js";

const app = express()
app.use(cors(
  {
    origin:"https://url-shortner-frontend-sable.vercel.app"
  }
));
app.use(express.json());

// Health check endpoint
app.get('/healthz', (req, res) => {
  res.status(200).json({ ok: true, version: "1.0" });
});

// API routes - support both /api/links (spec) and /api/v1/links (existing)
app.use('/api', router);


// Redirect route - must be after API routes
app.get('/:code', getUrl);

















app.listen(8001,()=>{
    connectDb()
    console.log(`Server is running on ${8001}`)
})