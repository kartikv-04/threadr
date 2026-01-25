import { api } from "../../lib/api";

export const getUser = async (userId: string) => {
    const res = await api.get(`/users/${userId}`);
    return res.data.data;
};
