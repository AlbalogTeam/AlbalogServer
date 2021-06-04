import jwt from 'jsonwebtoken';

export const showUser = async (req, res) => {
  const token = req.header('Authorization').replace('Bearer ', '');
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.header('Authorization');
  res.status(200).send({
    decoded,
  });
};
