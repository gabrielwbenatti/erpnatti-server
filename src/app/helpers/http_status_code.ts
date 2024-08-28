enum HttpStatusCode {
  // Informational (100-199)

  // Successful responses (200-299)
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,

  // Client error responses (400-499)
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  CONFLICT = 409,

  // Server error responses (500-599)
  INTERNAL_SERVER_ERROR = 500,
}

export default HttpStatusCode;
