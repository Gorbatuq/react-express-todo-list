import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";

export const useZodForm = (schema: z.ZodObject<any>) => {
  return useForm({
    resolver: zodResolver(schema),
  });
};
