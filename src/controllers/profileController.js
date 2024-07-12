const { default: axios } = require('axios');
const Profile = require('../models/profileModel');

const getAllProfile = async(req, res) => {
    try {
        const profile = await Profile.getAll(req.query.type);
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getProfileById = async(req, res) => {
    try {
        const profile = await Profile.getById(req.params.id);
        res.json(profile);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const verifyByLoginToken = async(req, res) => {
    try {
        const profile = await Profile.verifyByLoginToken(req.params.login_token);
        if (profile) {
            res.json({ status: true, profile });
        } else {
            res.json({ status: false, profile });
        };
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const getLoginToken = async(req, res) => {
    const { email } = req.params;
    console.log(email)
    try {
        const token = await Profile.getLoginToken(email);
        if (token) {
            console.log("dd", token)
            try {
                const response = await axios.post('http://localhost:3000/api/send-mail/token', {
                    log_token: token.login_token
                });
                res.json(response.data);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error calling another endpoint' });
            }
        } else {
            res.json({ status: false, token });
        };
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const createProfile = async(req, res) => {
    try {
        const newProfile = req.body;
        const resp = await Profile.create(newProfile);
        res.status(200).json(resp);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateProfile = async(req, res) => {
    try {
        const updatedProfile = req.body;
        const result = await Profile.update(req.params.id, updatedProfile);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const deleteProfile = async(req, res) => {
    try {
        await Profile.delete(req.params.id);
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

const updateProfilePhoto = async(req, res) => {
    try {
        const imageUrl = `/uploads/profiles/${req.file.filename}`;
        const response = await Profile.updateProfileImage(req.params.id, imageUrl);
        res.status(200).json({ response });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = {
    getAllProfile,
    getProfileById,
    createProfile,
    updateProfile,
    deleteProfile,
    updateProfilePhoto,
    verifyByLoginToken,
    getLoginToken
};