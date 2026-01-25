import { api } from "../../lib/api";

export const getUser = async (userId: string) => {
    const res = await api.get(`/auth/${userId}`);
    return res.data.data;
};
