import { Banner } from "@/app/generated/prisma/client";

export type BannerListItem = Banner;

export type BannerFormData = {
  imageUrl: string;
  linkUrl?: string;
  position: number;
  isActive: boolean;
};
