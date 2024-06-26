import httpStatus from "http-status";
import catchAsync from "../../Shared/catchAynsc";
import prisma from "../../Shared/prisma";
import config from "../../config/config";
import AppError from "../../helper/errorHelper/appError";
import JwtError from "../../helper/errorHelper/jwtError";
import { verifyToken } from "../../helper/jwtHelper";
import { UserRole } from "@prisma/client";

const checkAuth = (...roles: UserRole[]) => {
  return catchAsync(async (req, res, next) => {
    const token = req.headers.authorization as string;

    if (!token) {
      throw new JwtError("Token not found", httpStatus.UNAUTHORIZED);
    }

    //: verify token
    const decoded = verifyToken(token, config.jwt.jwt_access_token_secret);

    const { id, email, role } = decoded;

    //: check if user exists
    const user = await prisma.user.findUnique({
      where: {
        id,
        status: "ACTIVE",
      },
    });
    if (!user) {
      throw new AppError("User not found", 404);
    }

    //: check if user role is allowed to access the route
    if (role.length && !roles.includes(role)) {
      throw new JwtError("unauthorized access", httpStatus.UNAUTHORIZED);
    }

    //: set user in request object
    req.user = decoded;
    next();
  });
};

export default checkAuth;
