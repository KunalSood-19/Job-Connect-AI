import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import {
  getNotifications,
  markNotificationRead,
} from "@/api/notification";
import { socket } from "@/lib/socket";

export default function NotificationBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  async function load() {
    const res = await getNotifications();
    setNotifications(res.notifications);
  }
useEffect(() => {
  socket.on("notification", (notification) => {
    setNotifications((prev) => [notification, ...prev]);
  });

  return () => {
    socket.off("notification");
  };
}, []);

  const unread = notifications.filter((n) => !n.read).length;

  async function handleClick(notification: any) {
    if (!notification.read) {
      await markNotificationRead(notification.id);
    }

    window.location.href = notification.link;

    load();
  }

  return (
    <div className="relative">
   <button
  onClick={() => setOpen(!open)}
  className="relative h-9 w-9 rounded-full hover:bg-muted flex items-center justify-center transition"
>
        <Bell size={22} />

        {unread > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full text-xs px-2">
            {unread}
          </span>
        )}
      </button>

      {open && (
  <div className="absolute right-0 top-12 w-96 rounded-xl border bg-background shadow-2xl z-50 overflow-hidden">

          {notifications.length === 0 && (
            <div className="p-6 text-center">
              No notifications
            </div>
          )}

          {notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => handleClick(n)}
              className={`w-full text-left p-4 border-b hover:bg-gray-50 ${
                !n.read ? "bg-blue-50" : ""
              }`}
            >
              <h4 className="font-semibold">
                {n.title}
              </h4>

              <p className="text-sm text-gray-600">
                {n.message}
              </p>
            </button>
          ))}

        </div>
      )}
    </div>
  );
}