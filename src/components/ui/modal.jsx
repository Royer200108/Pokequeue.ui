import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

const modalVariants = cva(
  "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm",
)

const modalContentVariants = cva(
  "relative w-full max-w-lg rounded-lg bg-white dark:bg-zinc-900 p-6 shadow-lg",
  {
    variants: {
      size: {
        sm: "max-w-sm",
        default: "max-w-lg",
        lg: "max-w-2xl",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

function Modal({ open, onClose, children, size }) {
  if (!open) return null

  return (
    <div className={cn(modalVariants())} onClick={onClose}>
      <div
        className={cn(modalContentVariants({ size }))}
        onClick={(e) => e.stopPropagation()}
      >

        <Button variant="close" size="icon"
          onClick={onClose}
          aria-label="Cerrar"
        >
          <X className="h-4 w-4" />
        </Button>
        {children}
      </div>
    </div>
  )
}

export { Modal }
