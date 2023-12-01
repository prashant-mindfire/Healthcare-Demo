const { default: axios } = require("axios");
const asyncHandler = require("../middleware/asyncHandler");
const { TOKEN_URL } = require("../utils/constant");

exports.getToken = asyncHandler(async (req, res, next) => {
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const response = await axios.post(
    `${TOKEN_URL}`,
    {
      client_id: `${process.env.client_id}`,
      grant_type: "client_credentials",
      client_secret: `${process.env.client_secret}`,
      scope: "athena/service/Athenanet.MDP.*",
    },
    {
      headers,
    }
  );
  res.status(200).json({
    success: true,
    data: {
      token: response.data.access_token,
      expires_in: response.data.expires_in,
    },
  });
});
