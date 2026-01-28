export const isEducator = (req, res, next) => {
    if (req.user.role !== 'educator') {
        return res.status(403).json({
            error: 'Only educators are allowed to perform this action'
        });
    }
    next();
};
