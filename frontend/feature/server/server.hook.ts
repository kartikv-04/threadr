import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getServer, createServer, deleteServer, leaveServer } from "./server.api";
import { useAuthStore } from "@/feature/auth/AuthStore";
import { CreateServerRequest } from "./server.type";

export const useGetServer = () => {
    const token = useAuthStore(state => state.accessToken);
    return useQuery({
        queryKey: ['servers'],
        queryFn: getServer,
        enabled: !!token,
        staleTime: 1000 * 60 * 5,
    })
}

export const useCreateServer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateServerRequest) => createServer(data),
        onSuccess: () => {
            // Invalidate and refetch servers list after creation
            queryClient.invalidateQueries({ queryKey: ['servers'] });
        }
    });
}

export const useDeleteServer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (serverId: string) => deleteServer(serverId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['servers'] });
        }
    });
}

export const useLeaveServer = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (serverId: string) => leaveServer(serverId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['servers'] });
        }
    });
}