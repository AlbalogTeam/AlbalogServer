export const isOwner = (req, res, next) => {
  // 401 Unauthorized
  // 403 Forbidden
  if (!req.user.role.isAdmin)
    return res.status(403).send('Access denied Owner');

  next();
};

// module.exports = isOwner;
