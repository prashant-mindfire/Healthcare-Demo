const dotenv = require("dotenv");
const { default: axios } = require("axios");
dotenv.config({ path: ".env" });

exports.generateToken = async () => {
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  const response = await axios.post(
    "https://api.preview.platform.athenahealth.com/oauth2/v1/token",
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
  return {
    token: response.data.access_token,
    expiration: response.data.expires_in,
  };
};
