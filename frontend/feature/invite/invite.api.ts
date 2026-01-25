import { api } from "@/lib/api";
import { GetInviteInfoResponse, JoinServerResponse } from "./invite.type";

export const getInviteInfo = async (inviteCode: string): Promise<GetInviteInfoResponse> => {
    const res = await api.get(`/invite/${inviteCode}`);
    return res.data.data;
};

export const joinServer = async (data: { inviteCode: string; serverId: string }): Promise<JoinServerResponse> => {
    const res = await api.post("/invite/join", data);
    return res.data.data;
};
