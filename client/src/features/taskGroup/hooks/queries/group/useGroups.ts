import { useQuery } from "@tanstack/react-query"
import { groupApi } from "../../../../../api/groups"

export const useGroups = () => {
    return useQuery({
        queryKey: ["groups"],
        queryFn: groupApi.getAll
    })
}