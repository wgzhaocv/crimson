import { GuestGuard } from "@/providers/auth-provider";

const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  return <GuestGuard>{children}</GuestGuard>;
};

export default LoginLayout;
