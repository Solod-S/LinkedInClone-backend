const getCurrent = async (req, res) => {
  const user = req.user;

  res.status(200).json({ status: "succes", code: 200, data: user });
};

module.exports = getCurrent;
