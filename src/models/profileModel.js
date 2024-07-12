const db = require('../config/database');
const uuid = require('uuid');

const Profile = {
    getAll: async(type) => {
        const [rows] = await db.query('SELECT * FROM profiles WHERE type=?', type);
        return rows;
    },

    getById: async(id) => {
        const [rows] = await db.query('SELECT name, sm_links, description, followers, platforms, profile_image_url, type FROM profiles WHERE profiles.id = ?', [id]);
        return rows[0];
    },

    verifyByLoginToken: async(login_token) => {
        const [rows] = await db.query('SELECT login_token, id, email, type FROM profiles WHERE login_token=?', [login_token]);
        return rows[0];
    },

    getLoginToken: async(email) => {
        const [rows] = await db.query('SELECT login_token FROM profiles WHERE email=?', [email]);
        console.log(rows[0])
        return rows[0];
    },

    create: async(obj) => {
        const login_token = `login_${uuid.v4()}`;
        const id = `id_${uuid.v4()}`;
        const result = await db.query('INSERT INTO profiles (name, email, sm_links, profile_image_url, description, followers, login_token, platforms, id, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [obj.name, obj.email, obj.sm_links, "", obj.description, obj.followers, login_token, obj.platform, id, obj.type]);
        if (result[0].affectedRows > 0) {
            return {
                id: id,
                login_token: login_token
            };
        } else {
            return "REGISTRATION FAILED";
        }
    },

    update: async(id, updatedProfile) => {
        const [result] = await db.query('UPDATE profiles SET ? WHERE id = ?', [updatedProfile, id]);
        return result;
    },

    delete: async(id) => {
        await db.query('DELETE FROM profiles WHERE id = ?', [id]);
    },

    updateProfileImage: async(id, profileImageUrl) => {
        const result = await db.query('UPDATE profiles SET profile_image_url = ? WHERE id = ?', [profileImageUrl, id]);
        if (result[0].affectedRows > 0) {
            return {
                status: true
            };
        } else {
            return {
                status: false
            };
        }
    }
};

module.exports = Profile;