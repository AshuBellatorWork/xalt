const apiSuccessRes = (
  res,
  message = 'Success',
  data = null,
  code = 0,
  token = null
) => {
  return res.status(200).json({
    message,
    currentTime: Math.floor(Date.now() / 1000),
    code,
    error: false,
    data,
    token,
  });
};

const apiErrorRes = (
  res,
  message = 'Error',
  data = null,
  code = 1,
  status = 400
) => {
  return res.status(status).json({
    message,
    code,
    error: true,
    data,
  });
};

const apiTokenErrorRes = (
  res,
  message = 'Token Error',
  data = null,
  code = 1,
  status = 401
) => {
  return res.status(status).json({
    message,
    code,
    error: true,
    data,
  });
};

module.exports = {
  apiSuccessRes,
  apiErrorRes,
  apiTokenErrorRes,
};
