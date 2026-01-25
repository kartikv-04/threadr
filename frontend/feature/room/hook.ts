import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRooms, createRoom, generateInvite, getInviteInfo, joinServer, deleteRoom } from "./api";
import { useAuthStore } from "@/feature/auth/AuthStore";
import { NewRoomRequest, JoinServerRequest } from "./type";

export const useGetRooms = (serverId: string | null) => {
    const token = useAuthStore(state => state.accessToken);
    return useQuery({
        queryKey: ['rooms', serverId],
        queryFn: () => getRooms(serverId!),
        enabled: !!token && !!serverId,
        staleTime: 1000 * 60,
    });
}

export const useCreateRoom = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: NewRoomRequest) => createRoom(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['rooms', variables.serverId] });
        }
    });
}

export const useGenerateInvite = () => {
    return useMutation({
        mutationFn: (serverId: string) => generateInvite(serverId),
    });
}

export const useGetInviteInfo = (code: string) => {
    return useQuery({
        queryKey: ['invite', code],
        queryFn: () => getInviteInfo(code),
        enabled: !!code,
        retry: false,
    });
}

export const useJoinServer = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: JoinServerRequest) => joinServer(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['servers'] });
        }
    });
}

export const useDeleteRoom = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ serverId, roomId }: { serverId: string; roomId: string }) => deleteRoom(serverId, roomId),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['rooms', variables.serverId] });
        }
    });
}