'use client'

import { useState, useCallback } from 'react'

export interface Toast {
  id?: string
  title?: string
  description?: string
  variant?: 'default' | 'destructive'
  duration?: number
  action?: React.ReactNode
}

interface ToastState {
  toasts: Toast[]
}

let globalToastState: ToastState = { toasts: [] }
let toastListeners: Array<(state: ToastState) => void> = []

const notifyListeners = () => {
  toastListeners.forEach(listener => listener(globalToastState))
}

export function useToast() {
  const [, forceUpdate] = useState({})

  const rerender = useCallback(() => {
    forceUpdate({})
  }, [])

  // Subscribe to global state changes
  if (!toastListeners.includes(rerender)) {
    toastListeners.push(rerender)
  }

  const toast = useCallback(({ title, description, variant = 'default', duration = 5000 }: Toast) => {
    const id = Math.random().toString(36).substr(2, 9)
    const newToast: Toast = { id, title, description, variant, duration }
    
    globalToastState.toasts.push(newToast)
    notifyListeners()

    // Auto-remove toast after duration
    setTimeout(() => {
      globalToastState.toasts = globalToastState.toasts.filter(t => t.id !== id)
      notifyListeners()
    }, duration)

    return id
  }, [])

  const dismiss = useCallback((toastId: string) => {
    globalToastState.toasts = globalToastState.toasts.filter(t => t.id !== toastId)
    notifyListeners()
  }, [])

  return {
    toast,
    dismiss,
    toasts: globalToastState.toasts
  }
}