import Location from '../models/location/location';
// import checkOwnerHasLocation from '../middleware/checkOwnerHasLocation';

const create_location = async (req, res) => {
  const location = new Location({ ...req.body, owner: req.user._id });

  try {
    await location.save();
    req.user.stores = req.user.stores.concat({ location });
    await req.user.save();
    res.status(201).send({ location });
  } catch (error) {
    res.status(500).send({
      error,
    });
  }
};

//매장 정보 읽기
const get_location = async (req, res) => {
  const { id } = req.params;

  try {
    const location = await Location.findById(id);
    res.send({ location });
  } catch (error) {
    res.status(500).send({ error });
  }
};

//매장 정보 수정(주소 이름 전화번호)

//매장 스태프 추가

//매장 스태프 수정

//매장 스태프 삭제

module.exports = {
  create_location,
  get_location,
};
