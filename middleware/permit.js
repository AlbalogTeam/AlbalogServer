export default function permit(...permittedRoles) {
  return (req, res, next) => {
    const { owner, staff } = req;

    const user = owner
        ? owner
        : staff;

    if (user && permittedRoles.includes(user.role)) {
      next(); //role allowed
    } else {
      res.status(403).send({
        message: 'not allowed',
      });
    }
  };
}
