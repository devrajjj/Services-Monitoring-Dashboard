import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AppState, Theme, Notification } from '@/types'

interface AppStore extends AppState {
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
  
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  removeNotification: (id: string) => void
  markNotificationAsRead: (id: string) => void
  clearAllNotifications: () => void
  
  reset: () => void
}

const defaultTheme: Theme = {
  mode: 'dark',
  primary: '#3B82F6',
  secondary: '#10B981',
  accent: '#F59E0B'
}

const defaultState: AppState = {
  theme: defaultTheme,
  sidebarOpen: false,
  notifications: []
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...defaultState,
      
      toggleTheme: () => {
        const currentTheme = get().theme
        const newMode = currentTheme.mode === 'light' ? 'dark' : 'light'
        set({
          theme: {
            ...currentTheme,
            mode: newMode
          }
        })
      },
      
      setTheme: (theme: Theme) => {
        set({ theme })
      },
      
      toggleSidebar: () => {
        set(state => ({ sidebarOpen: !state.sidebarOpen }))
      },
      
      setSidebarOpen: (open: boolean) => {
        set({ sidebarOpen: open })
      },
      
      addNotification: (notificationData) => {
        const newNotification: Notification = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
          read: false,
          ...notificationData
        }
        
        set(state => ({
          notifications: [newNotification, ...state.notifications]
        }))
        
        if (notificationData.type === 'success') {
          setTimeout(() => {
            get().removeNotification(newNotification.id)
          }, 5000)
        }
      },
      
      removeNotification: (id: string) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }))
      },
      
      markNotificationAsRead: (id: string) => {
        set(state => ({
          notifications: state.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
          )
        }))
      },
      
      clearAllNotifications: () => {
        set({ notifications: [] })
      },
      
      reset: () => {
        set(defaultState)
      }
    }),
    {
      name: 'DemoCompany-app-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen
      })
    }
  )
)
