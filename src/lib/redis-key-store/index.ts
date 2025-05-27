export const RedisKeyStore = {
  verifyEmail: (id: string, email: string) => `vefify-email:${id}:${email}`,
  refreshToken: (refreshToken: string) => `refresh-token:${refreshToken}`,
};
