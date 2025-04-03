import DiaryEntry from "../models/DiaryEntry.js";
import { fetchWeather } from "./weatherController.js";
import mongoose from 'mongoose';
/**
* @route GET /api/diary
* @desc Fetch all diary entries with optional filters
* @access Public (Authentication will be added in Part 2)
*/
export const getAllEntries = async (req, res) => {
try {
const { search, tag, location } = req.query;
let filter = {}; // No authentication in Part 1, so no user filter is applied
// Search filter (Matches title or content)
if (search) {
filter.$or = [
{ title: { $regex: search, $options: "i" } },
{ content: { $regex: search, $options: "i" } }
];
}
// Tag filter (Exact match)
if (tag) {
filter.tags = tag;
}
// Location filter (Exact match)
if (location) {
filter.location = location;
}
// Fetch filtered results and sort by newest first
const entries = await DiaryEntry.find(filter).sort({ createdAt: -1 });
res.status(200).json(entries);
} catch (error) {
res.status(500).json({ message: "Server Error: Unable to fetch diary entries" });
}
};
/**
* @route GET /api/diary/:id
* @desc Fetch a single diary entry by ID
* @access Public (Authentication will be added in Part 2)
*/
export const getEntryById = async (req, res) => {
try {
const entry = await DiaryEntry.findById(req.params.id);
if (!entry) {
return res.status(404).json({ message: "Diary entry not found" });
}
res.status(200).json(entry);
} catch (error) {
res.status(500).json({ message: "Server Error: Unable to retrieve diary entry" });
}
};

/**
* @route POST /api/diary
* @desc Create a new diary entry
* @access Public (Authentication will be added in Part 2)
*
* TODO: Implement this function.
* - Extract required fields (title, content, location, tags, etc.) from `req.body`
* - Validate that title, content, and location are provided
* - Create a new `DiaryEntry` object and save it to the database
* - Return a `201 Created` response with the new entry
*/
export const createEntry = async (req, res) => {
    try {
        // Extract required fields from req.body
        const { user, title, content, location, tags, reflection, weather } = req.body;

        // Validate required fields
        if (!title || !content || !location) {
            return res.status(400).json({ message: "Title, content, and location are required." });
        }

        // Fetch weather data if location is provided
        const weatherData = location ? await fetchWeather(location) : null;

        console.log(weatherData);

        const newEntry = new DiaryEntry({
            user: user,
            title,
            content,
            reflection,
            tags,
            location,
            weather: weatherData
        });

        // Save to the database
        const savedEntry = await newEntry.save();

        // Return success response
        res.status(201).json(savedEntry);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
/**
* @route PUT /api/diary/:id
* @desc Update an existing diary entry
* @access Public (Authentication will be added in Part 2)
*
* TODO: Implement this function.
* - Extract updated fields from `req.body`
* - Find the entry by `req.params.id` and update it
* - Ensure that the entry exists before updating
* - Return the updated entry with a `200 OK` status
*/
export const updateEntry = async (req, res) => {
    try {
        // Extract the entry ID from request parameters
        //const { id } = req.params;

        // Extract updated fields from request body
        const { title, content, location, tags, reflection, weather } = req.body;

        // Find the entry by ID
        const entry = await DiaryEntry.findById(req.params.id);
        
        // If no entry exists, return 404
        if (!entry) {
            return res.status(404).json({ message: "Diary entry not found." });
        }

        // Update the entry
        const updatedEntry = await DiaryEntry.findByIdAndUpdate(
            id,
            { title, content, location, tags, reflection, weather, updatedAt: new Date() },
            { new: true, runValidators: true }
        );

        // Ensure that the entry was updated
        if (!updatedEntry) {
            return res.status(404).json({ message: "Diary entry not updated." });
        }

        // Return the updated entry
        res.status(200).json(updatedEntry);
    } catch (error) {
        
        res.status(500).json({ error: error.message });
    }
};
/**
* @route DELETE /api/diary/:id
* @desc Delete a diary entry
* @access Public (Authentication will be added in Part 2)
*
* TODO: Implement this function.
* - Find the entry by `req.params.id` and delete it
* - Ensure that the entry exists before deleting
* - Return a success message with a `200 OK` status
*/
export const deleteEntry = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid ID format." });
        }

        // Find and delete the entry
        const deletedEntry = await DiaryEntry.findByIdAndDelete(id);

        // Ensure the entry exists before deletion
        if (!deletedEntry) {
            return res.status(404).json({ message: "Diary entry not found." });
        }

        // Return a success message
        res.status(200).json({ message: "Diary entry deleted successfully." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};