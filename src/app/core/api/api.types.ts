export type User = {
  id: string;
  name: string;
  email: string;
  defaultCurrency: string;
  createdAt: string;
};

export type AuthResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
};

export type GroupSummary = {
  id: string;
  name: string;
  currency: string;
  createdBy: string;
  myNetMinor: number;
  memberCount: number;
  createdAt: string;
};

export type GroupMember = {
  userId: string;
  name: string;
  email: string;
  role: string;
  joinedAt: string;
  netMinor?: number;
};

export type SimplifiedPayment = {
  fromUserId: string;
  toUserId: string;
  amountMinor: number;
};

export type GroupDetail = GroupSummary & {
  members: GroupMember[];
  simplified?: SimplifiedPayment[];
};

export type ApiErrorBody = {
  error: {
    code: string;
    message: string;
    details?: { path: string; message: string }[];
  };
};
