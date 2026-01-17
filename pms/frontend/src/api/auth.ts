import { API_URL } from '../common';

export const fetchMe = async (token: string) => {
  return await fetch(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
