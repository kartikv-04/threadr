import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getRooms, creatRooms } from "./api";
import { useAuthStore } from "@/store/AuthStore";
import { NewRoomRequest } from "./type";

export const useGetRooms = () => {
    const token = useAuthStore(state=>state.accessToken);
    return useQuery({ queryKey : ['rooms'], queryFn : getRooms, enabled: !!token})
}

export const useCreateRoom = () => {
    const queryClient = useQueryClient();

    const token = useAuthStore(state=>state.accessToken);
    return useMutation({
        mutationFn : (data : NewRoomRequest) => creatRooms(data),
        onSuccess : () => {
            queryClient.invalidateQueries({queryKey : ['rooms']})
        }
    })
}