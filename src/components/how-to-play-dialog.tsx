"use client";

import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function HowToPlayDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="gap-2 border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary font-semibold"
        >
          <HelpCircle className="h-4 w-4" />
          <span className="hidden sm:inline">How to Play</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">How to Play Word Chain</DialogTitle>
          <DialogDescription>
            Learn the rules and scoring system
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Game Rules */}
          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">🎮 Game Rules</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="font-semibold text-foreground">1.</span>
                <span>The game starts with a <strong>random letter</strong>. Your first word must start with that letter.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground">2.</span>
                <span>After you submit a word, the <strong>next word must start with the last letter</strong> of your previous word.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground">3.</span>
                <span>All words must be <strong>at least 4 letters long</strong>.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground">4.</span>
                <span>Each word must be <strong>exactly 1 letter longer or shorter</strong> than your previous word (but never less than 4 letters).</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground">5.</span>
                <span><strong>No repeating words</strong> — each word can only be used once per game.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-semibold text-foreground">6.</span>
                <span>You have <strong>60 seconds</strong> to score as many points as possible!</span>
              </li>
            </ul>
          </section>

          {/* Word Length Rules */}
          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">📏 Word Length Rules</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>First word:</strong> Must be 4 or 5 letters (your choice)</p>
              <p><strong>After a 4-letter word:</strong> Next word must be 3 or 5 letters. But since words can't be less than 4 letters, you must play a 5-letter word.</p>
              <p><strong>After a 5-letter word:</strong> Next word must be 4 or 6 letters</p>
              <p><strong>After a 6-letter word:</strong> Next word must be 5 or 7 letters</p>
              <p className="mt-3 italic text-xs">The pattern continues: each word is ±1 letter from the last, creating a chain like 4→5→6→5→4→5...</p>
            </div>
          </section>

          {/* Scoring System */}
          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">⭐ Scoring System</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-lg border border-border bg-muted/30 p-4">
                <p className="font-semibold text-foreground mb-2">Base Points</p>
                <p>Each word earns points equal to its length:</p>
                <ul className="mt-2 space-y-1 ml-4">
                  <li>• 4-letter word = 4 points</li>
                  <li>• 5-letter word = 5 points</li>
                  <li>• 6-letter word = 6 points</li>
                  <li>• 7-letter word = 7 points</li>
                  <li>• And so on...</li>
                </ul>
              </div>

              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                <p className="font-semibold text-foreground mb-2"> Chain Multiplier (The Key!)</p>
                <p className="mb-2">Build your chain to multiply your points:</p>
                <ul className="space-y-1 ml-4">
                  <li>• <strong>1st word:</strong> 1.0x multiplier</li>
                  <li>• <strong>2nd word:</strong> 1.5x multiplier</li>
                  <li>• <strong>3rd word:</strong> 2.0x multiplier</li>
                  <li>• <strong>4th word:</strong> 2.5x multiplier</li>
                  <li>• And it keeps growing by 0.5x for each word!</li>
                </ul>
                <p className="mt-3 text-xs italic">Example: A 5-letter word with a 2.5x multiplier = 5 × 2.5 = 12.5 points!</p>
              </div>

              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                <p className="font-semibold text-foreground mb-2"> Breaking the Chain</p>
                <p>Your chain multiplier resets to 1.0x if you submit:</p>
                <ul className="mt-2 space-y-1 ml-4">
                  <li>• A word not in the dictionary</li>
                  <li>• A word with the wrong starting letter</li>
                  <li>• A word with an invalid length</li>
                </ul>
                <p className="mt-2 text-xs italic">Note: Using a word you've already played won't break your chain, but you'll need to try a different word.</p>
              </div>
            </div>
          </section>

          {/* Pro Tips */}
          <section className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground">💡 Pro Tips</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span>•</span>
                <span>Focus on <strong>building long chains</strong> rather than just long words — the multiplier is powerful!</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Plan ahead by thinking about which letter your word will end with.</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>Common ending letters like E, S, T, and R give you more options for the next word.</span>
              </li>
            </ul>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
