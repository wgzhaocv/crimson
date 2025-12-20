import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { CopyRight } from "@/components/Layout/CopyRight";
import { LoginCardContent } from "./components/LoginCard";
import { UserCount } from "./components/UserCount";

const LoginPage = () => {
  return (
    <div className="flex h-svh flex-col items-center justify-center">
      {/* Theme Toggle */}
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggle />
      </div>

      <Card className="border-border/50 bg-card/80 shadow-primary/5 w-full max-w-[400px] shadow-lg backdrop-blur-2xl duration-500 dark:shadow-2xl dark:shadow-black/60">
        <CardHeader className="space-y-4 pb-2 text-center">
          <div className="space-y-1">
            <CardTitle className="text-primary text-4xl leading-none font-black tracking-tighter uppercase italic">
              CRIMSON
            </CardTitle>
            <CardDescription className="text-muted-foreground text-[10px] font-bold tracking-widest uppercase opacity-70">
              ログインしてHTMLを共有
            </CardDescription>
          </div>
        </CardHeader>

        <LoginCardContent>
          <UserCount />
        </LoginCardContent>
      </Card>

      <CopyRight />
    </div>
  );
};

export default LoginPage;
