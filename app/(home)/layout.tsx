import { QueryProvider } from "@/providers/query-provider";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return <QueryProvider>{children}</QueryProvider>;
};

export default HomeLayout;
