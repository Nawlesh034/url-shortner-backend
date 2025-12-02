import { nanoid } from "nanoid";
import validateUrl from "../utils/validate_url.js";
import linkModel from "../models/url_schema.js";

export const createShort = async (req, res) => {
  try {
    const { target_url, code } = req.body;

    // 1) Validate presence of target_url
    if (!target_url) {
      return res.status(400).json({ message: "target_url required" });
    }

    // 2) Validate URL format
    if (!validateUrl(target_url)) {
      return res.status(400).json({ message: "url invalid" });
    }

    let finalCode = code;

    // 3) If user gave a custom code → validate + ensure unique
    if (finalCode) {
      if (!/^[A-Za-z0-9]{5}$/.test(finalCode)) {
        return res.status(400).json({
          message: "code must be 5 characters (A-Z, a-z, 0-9)",
        });
      }

      const exists = await linkModel.findOne({ code: finalCode });
      if (exists) {
        return res.status(409).json({ message: "custom code already exists" });
      }
    }

    // 4) If no code provided → auto-generate 5 char code
    if (!finalCode) {
      let unique = false;
      while (!unique) {
        finalCode = nanoid(5); // generate 5-character code
        const exists = await linkModel.findOne({ code: finalCode });
        if (!exists) unique = true;
      }
    }

    // 5) Create the link   // create - direct db mein save krta hai
    const link = await linkModel.create({
      target_url,
      code: finalCode,
    });

    // 6) Return final response
    return res.status(201).json({
      ok: true,
      code: link.code,
      target_url: link.target_url,
      created_at: link.created_at,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "server error" });
  }
};

export const getUrl = async (req, res) => {
  try {
    const { code } = req.params;

    // Atomic update -> increments click + updates last_clicked_at
    const link = await linkModel.findOneAndUpdate(
      { code },                              // find by code
      { 
        $inc: { total_clicks: 1 },           // increase count
        $set: { last_clicked_at: new Date() } 
      },
      { new: true }                          // return updated document
    );

    // If not found → send 404
    if (!link) {
      return res.status(404).json({ message: "Short URL not found" });
    }

    // Redirect to stored target URL
    return res.redirect(302, link.target_url);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "server error" });
  }
};

export const deleteLink = async(req,res)=>{
    const {code} = req.params
    const deleted = await linkModel.findOneAndDelete({ code });

  if (!deleted) return res.status(404).json({ message: "Link not found" });

  return res.status(200).json({ ok: true, message: "Deleted successfully" });
}

export const getAllUrl = async(req,res)=>{
   try {
     const data = await linkModel.find().sort({ created_at: -1 });
     return res.status(200).json({ ok: true, data });
   } catch (err) {
     console.error(err);
     return res.status(500).json({ message: "server error" });
   }
}

// Get stats for a single code (without incrementing clicks)
export const getStats = async (req, res) => {
  try {
    const { code } = req.params;
    const link = await linkModel.findOne({ code });
    
    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }
    
    return res.status(200).json({
      ok: true,
      code: link.code,
      target_url: link.target_url,
      total_clicks: link.total_clicks,
      last_clicked_at: link.last_clicked_at,
      created_at: link.created_at,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "server error" });
  }
};

