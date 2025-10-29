
import Navbar from "@/components/layout/Navbar";
import { Typography } from "@/components/ui/typography";

export default function Home() {
  return (
    <>
    <Navbar/>
    <div className="flex min-h-screen items-center justify-center bg-background font-sans dark:bg-background">
      <main className="flex min-h-screen w-full max-w-7xl flex-col items-center justify-between p-8 bg-background dark:bg-background sm:items-start">
        <div className="w-full h-[calc(100vh-3rem)] max-w-7xl bg-white rounded-lg flex items-center justify-center">
          <Typography variant="h1">You are not alone</Typography>
        </div>
      </main>
    </div>
    </>
  );
}
