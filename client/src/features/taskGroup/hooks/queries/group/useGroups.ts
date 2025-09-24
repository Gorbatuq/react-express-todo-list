import { groupApi } from "@/api/groups"
import { useQuery } from "@tanstack/react-query"

export const useGroups = () => {
    return useQuery({
        queryKey: ["groups"],
        queryFn: groupApi.getAll
    })
}