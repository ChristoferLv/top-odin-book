function checkUser(req, res, next) {
    if (!req.user) {
        return res.status(401).send({ success: false });
    }
    next();
}


export {
    checkUser
}