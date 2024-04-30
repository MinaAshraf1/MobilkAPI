module.exports = (funController) => {
    return (req, res, next) => {
        funController(req, res, next).catch((e) => {
            next(e);
        })
    }
}