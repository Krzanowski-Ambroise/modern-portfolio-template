'use client'

import { AnimatePresence } from 'framer-motion'
import Notification from './Notification'
import { useNotifications } from '@/contexts/NotificationContext'

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotifications()

  return (
    <div className="fixed bottom-4 right-4 z-[9999] space-y-2">
      <AnimatePresence>
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            {...notification}
            onClose={removeNotification}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default NotificationContainer
