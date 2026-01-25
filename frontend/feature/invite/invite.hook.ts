import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInviteInfo, joinServer } from "./invite.api";
import { useRouter } from "next/navigation";

export const useGetInviteInfo = (inviteCode: string) => {
    return useQuery({
        queryKey: ["invite", inviteCode],
        queryFn: () => getInviteInfo(inviteCode),
        enabled: !!inviteCode,
    });
};

export const useJoinServer = () => {
    const queryClient = useQueryClient();
    const router = useRouter();

    return useMutation({
        mutationFn: (data: { inviteCode: string; serverId: string }) => joinServer(data),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["servers"] });
            router.push(`/`);
        },
    });
};
