import { AuthProvider } from "@/providers/auth-provider";

const HomeLayout = ({ children }: { children: React.ReactNode }) => {
  return <AuthProvider>{children}</AuthProvider>;
};

export default HomeLayout;
