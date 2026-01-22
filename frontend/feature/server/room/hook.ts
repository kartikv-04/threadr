import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRooms, createRoom } from "./api";
import { useAuthStore } from "@/store/AuthStore";
import { NewRoomRequest } from "./type";

export const useGetRooms = (serverId: string | null) => {
    const token = useAuthStore(state => state.accessToken);
    return useQuery({
        queryKey: ['rooms', serverId],
        queryFn: () => getRooms(serverId!),
        enabled: !!token && !!serverId
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