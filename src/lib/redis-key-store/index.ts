export const RedisKeyStore = {
  verifyEmail: (id: string, email: string) => `vefify-email:${id}:${email}`,
  refreshToken: (refreshToken: string) => `refresh-token:${refreshToken}`,
  resetPasswordVerifyEmail: (id: string, email: string) =>
    `reset-password-vefify-email:${id}:${email}`,
  userTimezone: (userId: string) => `user-time-zone:${userId}`,
};
