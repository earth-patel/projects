const axios = require('axios');
const { oauth2client } = require('../utils/googleConfig');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

const googleLogin = async (req, res) => {
    try {
        const { code } = req.query;
        const googleRes = await oauth2client.getToken(code);
        oauth2client.setCredentials(googleRes.tokens);
        const userRes = await axios.get(
            `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${googleRes.tokens.access_token}`
        )
        const { name, email, picture } = userRes.data;

        let user = await UserModel.findOne({ where: { email } });
        if (!user) {
            user = await UserModel.create({
                name,
                email,
                image: picture,
            })
        }

        const token = jwt.sign({ id: user.id, email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TIMEOUT });

        res.status(200).json({ message: 'Success', token, user })
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

module.exports = { googleLogin }
