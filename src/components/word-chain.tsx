import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { PlayedWord } from "@/lib/types";

interface WordChainProps {
  words: PlayedWord[];
}

export function WordChain({ words }: WordChainProps) {
  const hasWords = words.length > 0;

  return (
    <Card className="flex h-full flex-col border-none bg-white/70 shadow-lg">
      <CardHeader className="border-none pb-0">
        <div>
          <p className="text-sm uppercase tracking-wide text-slate-500">Word Chain</p>
          <p className="text-xl font-semibold text-slate-900">Words played ({words.length})</p>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pb-6">
        {hasWords ? (
          <ScrollArea className="h-72">
            <ul className="space-y-3 pr-1">
              {words.map((entry, index) => {
                const isLatest = index === words.length - 1;
                return (
                  <li
                    key={entry.id}
                    className={cn(
                      "flex items-center justify-between rounded-lg border px-4 py-3 text-sm shadow-sm",
                      isLatest ? "border-indigo-200 bg-indigo-50/80" : "border-slate-200 bg-white",
                    )}
                  >
                    <div>
                      <p className="text-base font-semibold tracking-wide text-slate-900">
                        {entry.value.toUpperCase()}
                      </p>
                      <p className="text-xs text-slate-500">
                        +{entry.pointsAwarded} pts &bull; multiplier x{entry.multiplierApplied}
                      </p>
                    </div>
                    <Badge variant="secondary">{entry.length} letters</Badge>
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        ) : (
          <div className="flex h-72 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/70 text-center">
            <p className="max-w-[16rem] text-sm text-slate-500">
              Start typing words to build your chain. Each word must follow the letter and length rules.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
