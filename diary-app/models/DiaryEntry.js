import mongoose from "mongoose";
const diarySchema = new mongoose.Schema(
{
user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}, // User who owns the entry
title: { type: String, required: true }, // Title of the diary entry
content: { type: String, required: true }, // Main diary content
// Optional personal reflection field
reflection: {
type: String,
trim: true,
maxlength: 500
},
// User specified location (city, country)
location: {
type: String,
required: true
},
tags: { type: [String], default: [] },
weather: {
condition: { type: String }, // e.g., "Sunny", "Cloudy"
temperature: { type: Number }, // Temperature in °F
location: { type: String } // City, country - user specified
}
},
{ timestamps: true } // Automatically adds createdAt & updatedAt
);
/**
* Create the DiaryEntry model based on the schema
*/
const DiaryEntry = mongoose.model("DiaryEntry", diarySchema);
/**
* Export the DiaryEntry Mongoose model for database operations
*
* Usage:
* import DiaryEntry from "../models/DiaryEntry.js";
*
*/
export default DiaryEntry;