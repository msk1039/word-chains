import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { MobileNav } from "@/components/mobile-nav";
import { LogoutButton } from "@/components/auth/logout-button";
import { HowToPlayDialog } from "@/components/how-to-play-dialog";

export async function NavBar() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-lg font-semibold text-foreground">
            Word Chain
          </Link>
          <nav className="hidden items-center gap-3 text-sm font-medium text-muted-foreground sm:flex">
            <Link href="/" className="transition hover:text-foreground">
              Game
            </Link>
            <Link href="/leaderboard" className="transition hover:text-foreground">
              Leaderboard
            </Link>
            {session && (
              <Link href="/profile" className="transition hover:text-foreground">
                Profile
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {/* How to Play button - visible on all screen sizes */}
          <HowToPlayDialog />
          
          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:gap-2">
            {session ? (
              <LogoutButton />
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href="/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>
          {/* Mobile Navigation */}
          <div className="sm:hidden">
            <MobileNav session={session} />
          </div>
        </div>
      </div>
    </header>
  );
}
