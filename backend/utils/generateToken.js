/**
 * Generates a JWT for the user and sets it as an httpOnly cookie,
 * while also returning the token in the JSON response for
 * clients that prefer Authorization header based auth (mobile apps, etc).
 */
export const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const cookieExpireDays = Number(process.env.JWT_COOKIE_EXPIRE) || 30;
  const options = {
    expires: new Date(Date.now() + cookieExpireDays * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
    },
  });
};
