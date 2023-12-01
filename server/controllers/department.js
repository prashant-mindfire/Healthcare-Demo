const { default: axios } = require("axios");
const asyncHandler = require("../middleware/asyncHandler");
const { BASE_URL } = require("../utils/constant");

exports.getDepartments = asyncHandler(async (req, res, next) => {
  const cache = req.cache;
  const token = cache.get("token");
  const headers = {
    Authorization: `Bearer ${token}`,
    accept: "application/json",
  };
  const response = await axios.get(
    `${BASE_URL}/departments?showalldepartments=true&providerlist=true`,
    { headers }
  );
  res.status(200).json({ success: true, data: response.data.departments });
});
