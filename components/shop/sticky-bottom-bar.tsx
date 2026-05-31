import { ChevronLeft, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"

interface StickyBottomBarProps {
  canGoBack: boolean
  canGoNext: boolean
  nextLabel?: string
  onBack: () => void
  onNext: () => void
  hideNext?: boolean
}

export default function StickyBottomBar({ canGoBack, canGoNext, nextLabel = "Dalej", onBack, onNext, hideNext = false }: StickyBottomBarProps) {
  return (
    <div className="sticky bottom-0 z-20 border-t border-zinc-200 bg-white/95 px-4 py-3 backdrop-blur lg:px-0">
      <div className="mx-auto flex max-w-6xl gap-3">
        <Button type="button" variant="outline" className="h-12 flex-1 rounded-2xl" onClick={onBack} disabled={!canGoBack}>
          <ChevronLeft className="h-4 w-4" />
          Wstecz
        </Button>
        {!hideNext ? (
          <Button type="button" className="h-12 flex-[1.4] rounded-2xl" onClick={onNext} disabled={!canGoNext}>
            {nextLabel}
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : null}
      </div>
    </div>
  )
}
