export function response(res, code, message, data) {
  return res.status(code).json({
    status: code === 200 ? true : false,
    message,
    data,
  });
}

export function errorResponse(res, code, message, error) {
  return res.status(code).json({
    status: code,
    message,
    error,
  });
}
