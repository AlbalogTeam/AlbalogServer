export default function permit(...permittedRoles) {
  return (req, res, next) => {
    const { owner, staff } = req;

    const user = owner
        ? owner
        : staff;

    if (owner && permittedRoles.includes(owner.role)) {
      next(); //role allowed
    } else {
      res.status(403).send({
        message: 'not allowed',
      });
    }
  };
}
