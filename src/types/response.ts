export enum ReturnCode {
  SUCCESS = "300",
  FAILED = "200",
  TOKEN_EXPIRE = "301",
}

export enum ReturnMessage {
  SUCCESS = "Successfullly!",
  FAILED = "An error occured!",
  // JWT
  AUTH_MISS = "Authorization header missing",
  AUTH_MALFORMED = "Authorization header malformed",
  UNAUTHORIZED = "Unauthorized",
  TOKEN_EXPIRE = "Token Expired",
  TOKEN_MISS = "Token missing",
  INVTOKEN = "Invalid token",
  //
  PERMISSION_DENIED = "Permission Denied!",
  IDREQUIRED = "ID is required!",
}
