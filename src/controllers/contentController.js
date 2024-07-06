const Content = require('../models/contentModel');
const path = require('path');
const fs = require('fs');

const getAllContent = async(req, res) => {
    try {
        const content = await Content.getAll();
        res.json(content);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getContentById = async(req, res) => {
    try {
        const content = await Content.getById(req.params.id);
        res.json(content);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const countContentByUpload = async(req, res) => {
    try {
        const content = await Content.contentCount(req.params.id);
        res.json(content);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createContent = async(req, res) => {
    try {
        const newContent = req.body;
        const id = await Content.create(newContent);
        res.status(201).json({ id });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateContent = async(req, res) => {
    try {
        const updatedContent = req.body;
        await Content.update(req.params.id, updatedContent);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteContent = async(req, res) => {
    try {
        await Content.delete(req.params.id);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const uploadVideo = async(req, res) => {
    try {
        const videoUrl = `/uploads/videos/${req.file.filename}`;
        const response = await Content.uploadVideo(req.body, videoUrl);
        res.status(200).json({ response });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteVideo = async(req, res) => {
    try {
        const content = await Content.getById(req.params.id);
        if (content && content.video_url) {
            const filePath = path.join(__dirname, '../../', content.video_url);
            fs.unlinkSync(filePath);
            const response = await Content.deleteVideo(req.params.id);
            return res.status(200).json({ response });
        }
        return res.status(500).json({ error: "SOMETHING WENT WRONG" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllContent,
    getContentById,
    createContent,
    updateContent,
    deleteContent,
    uploadVideo,
    deleteVideo,
    countContentByUpload
};