const jwt = require("jsonwebtoken");

const checkToken = (req, res, next) => {
    const header = req.headers["authorization"];

    if (typeof header !== 'undefined') {
        const token = header.split(' ')[1];

        try {
            const decoded = jwt.verify(token, "keyboard cat");
        } catch (err) {
            res.sendStatus(403);
        }

        console.log('authenticated');

        req.token = token;
        next();
    } else {
        res.sendStatus(403);
    }
}

module.exports = checkToken;