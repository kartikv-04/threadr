import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getServer, createServer } from "./api";
import { useAuthStore } from "@/feature/auth/AuthStore";
import { CreateServerRequest } from "./type";

export const useGetServer = () => {
    const token = useAuthStore(state => state.accessToken);
    return useQuery({ queryKey: ['servers'], queryFn: getServer, enabled: !!token })
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