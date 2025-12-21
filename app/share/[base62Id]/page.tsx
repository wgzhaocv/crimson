import { base62ToSnowflake } from "@/lib/base62";
import { getShareCache } from "@/lib/redisCache/shareCache";

const ShareValidationPage = async ({
  params,
}: {
  params: Promise<{ base62Id: string }>;
}) => {
  const { base62Id } = await params;
  const id = base62ToSnowflake(base62Id);
  const shareData = await getShareCache(id);
  if (!shareData) {
    return <div>Share not found</div>;
  }
  return <div>SharePage</div>;
};

export default ShareValidationPage;
