import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

type NotificationType = 'success' | 'error'

interface NotificationState {
  message: string
  type: NotificationType
}

interface NotificationContextValue {
  showNotification: (message: string, type?: NotificationType) => void
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<NotificationState | null>(null)

  const showNotification = useCallback((message: string, type: NotificationType = 'success') => {
    setNotification({ message, type })
    window.setTimeout(() => {
      setNotification((current) => (current?.message === message ? null : current))
    }, 2500)
  }, [])

  const value = useMemo(() => ({ showNotification }), [showNotification])

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {notification ? (
        <div className="pointer-events-none fixed right-4 top-4 z-[60]">
          <div
            className={`rounded-lg px-4 py-2 text-sm font-semibold text-white shadow-lg ${
              notification.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
            }`}
          >
            {notification.message}
          </div>
        </div>
      ) : null}
    </NotificationContext.Provider>
  )
}

export function useNotification() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider')
  }
  return context
}
