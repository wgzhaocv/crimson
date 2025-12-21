import { z } from "zod";

// 基础字段
const accessTypeSchema = z.enum(["public", "password", "private"]);

// 创建时的 schema
export const createShareSchema = z
  .object({
    html: z.string().min(1, "HTMLコンテンツは必須です"),
    title: z.string().nullable(),
    accessType: accessTypeSchema,
    pin: z.string().nullable(),
  })
  .refine(
    (data) =>
      data.accessType !== "password" || (data.pin && data.pin.length > 0),
    {
      message: "パスワード保護された共有にはPINが必要です",
      path: ["pin"],
    },
  );

// 更新时的 schema（changePin 控制是否更新 PIN）
export const updateShareSchema = z
  .object({
    html: z.string().min(1, "HTMLコンテンツは必須です"),
    title: z.string().nullable(),
    accessType: accessTypeSchema,
    changePin: z.boolean(),
    pin: z.string().nullable(),
  })
  .refine(
    (data) =>
      data.accessType !== "password" ||
      !data.changePin ||
      (data.pin && data.pin.length > 0),
    {
      message: "パスワード保護された共有にはPINが必要です",
      path: ["pin"],
    },
  );

export type CreateShareInput = z.infer<typeof createShareSchema>;
export type UpdateShareInput = z.infer<typeof updateShareSchema>;
