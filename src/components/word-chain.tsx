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
    <Card className="border-border bg-card/90 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Word History</h2>
          <Badge variant="secondary" className="text-sm">
            {words.length} {words.length === 1 ? "word" : "words"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        {hasWords ? (
          <ScrollArea className="h-64 pr-4">
            <ul className="space-y-2">
              {[...words].reverse().map((entry, index) => {
                const originalIndex = words.length - 1 - index;
                const isLatest = originalIndex === words.length - 1;
                return (
                  <li
                    key={entry.id}
                    className={cn(
                      "flex items-center justify-between rounded-lg border px-3 py-2.5 transition-colors",
                      isLatest 
                        ? "border-primary/30 bg-primary/5 shadow-sm" 
                        : "border-border bg-card hover:bg-accent/50",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
                        {originalIndex + 1}
                      </div>
                      <div>
                        <p className={cn(
                          "text-base font-semibold tracking-wide",
                          isLatest ? "text-primary" : "text-foreground"
                        )}>
                          {entry.value.toUpperCase()}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          +{entry.pointsAwarded} pts • x{(1 + entry.multiplierApplied * 0.5).toFixed(1)} multiplier
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {entry.length}
                    </Badge>
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50">
            <div className="max-w-[200px] text-center">
              <p className="text-sm font-medium text-foreground">No words yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Start typing to build your chain!
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
