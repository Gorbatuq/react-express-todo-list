import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Заголовок обовʼязковий").max(100, "Максимум 100 символів"),
});

export const updateTaskTitleSchema = z.object({
  title: z.string().min(1, "Новий заголовок обовʼязковий"),
});

export const createGroupSchema = z.object({
  title: z.string().min(1, "Назва обовʼязкова").max(100, "Максимум 100 символів"),
});

export const reorderGroupsSchema = z.object({
  order: z.array(z.string().min(1))
});


export const reorderTaskSchema = z.object({
  order: z.array(z.string().min(1))
});