"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Check, Loader2 } from "lucide-react"
import { PROCESSING_STEPS } from "@/lib/utils/constants"

interface ProcessingAnimationProps {
  progress: number
  currentStep: string
  completedSteps: string[]
}

export function ProcessingAnimation({ progress, currentStep, completedSteps }: ProcessingAnimationProps) {
  return (
    <Card className="border-primary/20">
      <CardContent className="p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Processing statement</span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-0">
          {PROCESSING_STEPS.map((step, index) => {
            const isCompleted = completedSteps.includes(step.id)
            const isActive = currentStep === step.id

            return (
              <div
                key={step.id}
                className={`processing-step ${isCompleted ? "completed" : ""} ${isActive ? "active" : ""} ${!isCompleted && !isActive ? "pending" : ""}`}
              >
                <div className={`step-dot flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs transition-all ${
                  isCompleted ? "bg-emerald-500 text-white" : isActive ? "bg-primary text-white animate-pulse" : "bg-muted text-muted-foreground"
                }`}>
                  {isCompleted ? <Check className="h-3.5 w-3.5" /> : isActive ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <span>{index + 1}</span>}
                </div>
                <div className="flex flex-col">
                  <span className={`text-sm font-medium ${isActive ? "text-primary" : ""}`}>{step.label}</span>
                  <span className="text-xs text-muted-foreground">{step.description}</span>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
