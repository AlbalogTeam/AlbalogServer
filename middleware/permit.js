export default function permit(...permittedRoles) {
  return (req, res, next) => {
    const { user } = req;

    if (user && permittedRoles.includes(user.role)) {
      next(); //role allowed
    } else {
      res.status(403).send({
        message: 'not allowed',
      });
    }
  };
}
