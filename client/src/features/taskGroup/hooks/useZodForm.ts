import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const useZodForm = (schema: any) => {
  return useForm({
    resolver: zodResolver(schema),
    mode: "onSubmit", 
    reValidateMode: "onSubmit", 
  });
};

