const db = require('../config/database');
const uuid = require('uuid');

const Content = {
    getAll: async() => {
        const [rows] = await db.query('SELECT * FROM content');
        return rows;
    },

    getById: async(id) => {
        const [rows] = await db.query('SELECT * FROM content WHERE id = ?', [id]);
        return rows[0];
    },

    contentCount: async(id) => {
        const [rows] = await db.query('SELECT COUNT(*) AS videos FROM content WHERE uploaded_by=?', [id]);
        return rows[0];
    },

    create: async(newContent) => {
        const result = await db.query('INSERT INTO content SET ?', newContent);
        return result[0].insertId;
    },

    update: async(id, updatedContent) => {
        await db.query('UPDATE content SET ? WHERE id = ?', [updatedContent, id]);
    },

    delete: async(id) => {
        await db.query('DELETE FROM content WHERE id = ?', [id]);
    },

    uploadVideo: async(obj, videoUrl) => {
        const id = `vid_${uuid.v4()}`;
        const isUploaded = await db.query('INSERT INTO content (title, subtitle, hashtags, uploaded_by, video_url, id) VALUES (?, ?, ?, ?, ?, ?)', [obj.title, obj.subtitle, obj.hashtags, obj.uploaded_by, videoUrl, id]);
        return isUploaded[0];
    },

    deleteVideo: async(id) => {
        const isDeleted = await db.query('DELETE FROM content WHERE id=?', id);
        console.log(id, isDeleted)
        return isDeleted[0];
    }
};

module.exports = Content;