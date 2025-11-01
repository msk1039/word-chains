import { FormEvent, useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator } from "@/components/ui/input-otp";
import { Badge } from "@/components/ui/badge";
import type { GameStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

interface GameBoardProps {
  currentLetter: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: () => Promise<void>;
  allowedLengths: number[];
  validationError: string | null;
  status: GameStatus;
  isDisabled: boolean;
  sanitizeInput: (raw: string) => string;
  isSubmitting: boolean;
  chainMultiplier: number;
}

export function GameBoard({
  currentLetter,
  inputValue,
  onInputChange,
  onSubmit,
  allowedLengths,
  validationError,
  status,
  isDisabled,
  sanitizeInput,
  isSubmitting,
  chainMultiplier,
}: GameBoardProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const prevValidationErrorRef = useRef<string | null>(null);

  // Auto-focus input when it becomes empty after submission or when validation error changes
  useEffect(() => {
    if (!inputValue && !isDisabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputValue, isDisabled]);

  // Focus input when validation error appears
  useEffect(() => {
    if (validationError && validationError !== prevValidationErrorRef.current && inputRef.current) {
      inputRef.current.focus();
    }
    prevValidationErrorRef.current = validationError;
  }, [validationError]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await onSubmit();
  };

  const lengthHint =
    allowedLengths.length === 0
      ? "4-5 letters"
      : allowedLengths.length === 1
        ? `${allowedLengths[0]} letters`
        : `${allowedLengths.join(" or ")} letters`;

  const multiplierDisplay = (chainMultiplier > 0 ? 1 + chainMultiplier * 0.5 : 1).toFixed(1);

  // --- New Dynamic Rendering Logic ---
  const minLength = allowedLengths.length > 0 ? Math.min(...allowedLengths) : 0;
  const maxLength = allowedLengths.length > 0 ? Math.max(...allowedLengths) : 12;
  
  // Special case: [3, 5] should render as a single block of 5
  const isSpecialCase35 = 
    allowedLengths.length === 2 && 
    allowedLengths.includes(3) && 
    allowedLengths.includes(5);
  // --- End New Logic ---

  // Determine if input is complete
  const isComplete = allowedLengths.includes(inputValue.length);
  
  // Determine input state color
  const getInputBorderColor = () => {
    if (!inputValue) return "";
    if (isComplete && !validationError) return "border-emerald-500";
    if (validationError) return "border-rose-500";
    return "";
  };

  return (
    <Card className="relative overflow-hidden border-2 border-primary/20 bg-card/90 shadow-xl">
      {/* Chain Multiplier Badge - Top Right */}
      <div className="absolute right-4 top-4 z-10">
        <Badge 
          variant="secondary" 
          className="bg-accent text-accent-foreground border border-border px-3 py-1 text-sm font-semibold shadow-sm"
        >
          x{multiplierDisplay} chain
        </Badge>
      </div>

      <CardContent className="space-y-6 p-6 sm:p-8">
        {/* Current Letter Display */}
        <div className="text-center space-y-1">
          <p className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
            Start with
          </p>
          <div className="flex items-center justify-center">
            <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-primary/80 shadow-lg ring-4 ring-primary/10">
              <p className="text-6xl font-bold text-primary-foreground" aria-live="polite">
                {currentLetter}
              </p>
            </div>
          </div>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <div className={cn("flex justify-center transition-all", getInputBorderColor())}>
              <InputOTP
                ref={inputRef}
                maxLength={maxLength}
                value={inputValue}
                onChange={(value) => onInputChange(value.toUpperCase())}
                disabled={isDisabled || isSubmitting}
                className={cn(getInputBorderColor())}
              >
                {isSpecialCase35 || allowedLengths.length === 1 ? (
                  // Render a single group for the special case [3, 5] or when only one length is allowed
                  <InputOTPGroup>
                    {Array.from({ length: maxLength }).map((_, i) => (
                      <InputOTPSlot 
                        key={i} 
                        index={i} 
                        className={cn(
                          "h-14 w-12 text-2xl font-bold",
                          getInputBorderColor()
                        )}
                      />
                    ))}
                  </InputOTPGroup>
                ) : (
                  // Render two groups with a separator for all other cases
                  <>
                    <InputOTPGroup>
                      {Array.from({ length: minLength }).map((_, i) => (
                        <InputOTPSlot 
                          key={i} 
                          index={i} 
                          className={cn(
                            "h-14 w-12 text-2xl font-bold",
                            getInputBorderColor()
                          )}
                        />
                      ))}
                    </InputOTPGroup>
                    {maxLength > minLength && (
                      <>
                        <InputOTPSeparator />
                        <InputOTPGroup>
                          {Array.from({ length: maxLength - minLength }).map((_, i) => (
                            <InputOTPSlot 
                              key={i + minLength} 
                              index={i + minLength} 
                              className={cn(
                                "h-14 w-12 text-2xl font-bold",
                                getInputBorderColor()
                              )}
                            />
                          ))}
                        </InputOTPGroup>
                      </>
                    )}
                  </>
                )}
              </InputOTP>
            </div>
            <p id="word-hint" className="text-center text-sm text-muted-foreground">
              Must be {lengthHint}
            </p>
          </div>

          <Button 
            type="submit" 
            disabled={isDisabled || isSubmitting} 
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            {isSubmitting ? "Checking..." : "Submit"}
          </Button>

          {validationError ? (
            <div
              id="word-error"
              className="rounded-lg border-2 border-destructive/20 bg-destructive/10 px-4 py-3 text-center text-sm font-medium text-destructive"
              role="alert"
            >
              {validationError}
            </div>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
