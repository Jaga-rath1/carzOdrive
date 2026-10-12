function success(res, data, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({ success: true, message, data });
}

function created(res, data, message = 'Created') {
  return success(res, data, message, 201);
}

function paginated(res, data, pagination, message = 'Success') {
  return res.status(200).json({ success: true, message, data, pagination });
}

function error(res, message = 'Internal server error', statusCode = 500, errors = null) {
  const body = { success: false, message };
  if (errors) body.errors = errors;
  return res.status(statusCode).json(body);
}

function notFound(res, message = 'Resource not found') {
  return error(res, message, 404);
}

function unauthorized(res, message = 'Unauthorized') {
  return error(res, message, 401);
}

function forbidden(res, message = 'Forbidden') {
  return error(res, message, 403);
}

function badRequest(res, message = 'Bad request', errors = null) {
  return error(res, message, 400, errors);
}

module.exports = { success, created, paginated, error, notFound, unauthorized, forbidden, badRequest };
