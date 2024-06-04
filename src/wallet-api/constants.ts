export const Permission = {
  ACCOUNTS: 'accounts',
} as const;

export type Permission = (typeof Permission)[keyof typeof Permission];
