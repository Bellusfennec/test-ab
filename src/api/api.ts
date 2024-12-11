import { User } from "../types";

export const fetchUsers = async (page: number): Promise<User[]> => {
  const response = await fetch(`https://frontend-test-middle.vercel.app/api/users?page=${page}&limit=50`);
  if (!response.ok) {
    throw new Error("Failed to fetch users");
  }
  const data = await response.json();
  return data.data;
};
