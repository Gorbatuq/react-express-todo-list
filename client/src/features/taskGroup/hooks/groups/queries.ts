// src/hooks/groups/queries.ts
import { useQuery } from "@tanstack/react-query";
import { groupApi } from "@/api/groups";
import { qk } from "../queryKeys";
export const useGroups = () => useQuery({ queryKey: qk.groups, queryFn: groupApi.getAll });
