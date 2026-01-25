import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getServer, createServer } from "./server.api";
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