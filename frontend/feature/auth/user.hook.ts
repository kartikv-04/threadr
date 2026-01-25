import { useQuery } from "@tanstack/react-query";
import { getUser } from "./user.api";

export const useUser = (userId: string | null) => {
    return useQuery({
        queryKey: ["user", userId],
        queryFn: () => getUser(userId!),
        enabled: !!userId,
    });
};
