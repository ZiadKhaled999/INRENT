
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Bell, Check, X, User, Trash2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger, DrawerDescription } from "@/components/ui/drawer";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
    }
  }, [user]);

  // Real-time subscription for notifications with proper cleanup
  useEffect(() => {
    if (!user?.id) return;

    const channel = supabase
      .channel('notifications-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('New notification received:', payload);
          const newNotification = payload.new as Notification;
          setNotifications(prev => [newNotification, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Notification updated:', payload);
          const updatedNotification = payload.new as Notification;
          setNotifications(prev => 
            prev.map(n => n.id === updatedNotification.id ? updatedNotification : n)
          );
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'DELETE',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Notification deleted via realtime:', payload);
          const deletedId = payload.old.id;
          setNotifications(prev => prev.filter(n => n.id !== deletedId));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const fetchNotifications = async () => {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      setNotifications(data || []);
    } catch (error: any) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Failed to load notifications",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      console.log('Attempting to delete notification:', notificationId);
      
      // Perform the delete operation with proper error handling
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('user_id', user?.id); // Extra security check

      if (error) {
        console.error('Supabase delete error:', error);
        throw error;
      }

      console.log('Notification deleted successfully from database');
      
      // Optimistic update - remove from local state immediately
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      
      toast({
        title: "Notification deleted",
        description: "The notification has been removed.",
      });
    } catch (error: any) {
      console.error('Error deleting notification:', error);
      toast({
        title: "Failed to delete notification",
        description: error.message,
        variant: "destructive",
      });
      // Refresh notifications to ensure UI is in sync
      await fetchNotifications();
    }
  };

  const handleJoinRequest = async (notificationId: string, action: 'approve' | 'dismiss') => {
    setOpen(false);
    try {
      const notification = notifications.find(n => n.id === notificationId);
      if (!notification) return;

      // Extract household ID, user ID, and display name from message
      const householdIdMatch = notification.message.match(/Household ID: ([^,]+)/);
      const userIdMatch = notification.message.match(/User ID: ([^,]+)/);
      const displayNameMatch = notification.message.match(/Display Name: (.+)$/);
      
      if (!householdIdMatch || !userIdMatch || !displayNameMatch) {
        throw new Error('Invalid notification format');
      }

      const householdId = householdIdMatch[1];
      const userId = userIdMatch[1];
      const displayName = displayNameMatch[1];

      if (action === 'approve') {
        // Extract email from notification message
        const emailMatch = notification.message.match(/\(([^)]+)\)/);
        const email = emailMatch ? emailMatch[1] : '';

        // Add user as household member
        const { error: memberError } = await supabase
          .from('household_members')
          .insert({
            household_id: householdId,
            user_id: userId,
            display_name: displayName,
            email: email,
            role: 'resident'
          });

        if (memberError) throw memberError;

        // Create approval notification for the user
        const { error: approvalNotificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: userId,
            type: 'join_approved',
            title: 'Join Request Approved',
            message: `Your request to join the household has been approved! You can now access the household dashboard.`,
            read: false
          });

        if (approvalNotificationError) {
          console.error('Error creating approval notification:', approvalNotificationError);
        }

        toast({
          title: "Request approved",
          description: "The user has been added to your household.",
        });
      } else {
        // Create dismissal notification for the user
        const { error: dismissalNotificationError } = await supabase
          .from('notifications')
          .insert({
            user_id: userId,
            type: 'join_dismissed',
            title: 'Join Request Dismissed',
            message: `Your request to join the household has been dismissed.`,
            read: false
          });

        if (dismissalNotificationError) {
          console.error('Error creating dismissal notification:', dismissalNotificationError);
        }

        toast({
          title: "Request dismissed",
          description: "The join request has been dismissed.",
        });
      }

      // Delete the join request notification after processing
      await deleteNotification(notificationId);

    } catch (error: any) {
      console.error('Error handling join request:', error);
      toast({
        title: "Failed to process request",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)
        .eq('user_id', user?.id);

      if (error) throw error;
    } catch (error: any) {
      console.error('Error marking notification as read:', error);
    }
  };

  const unreadNotifications = notifications.filter(n => !n.read);

  const triggerButton = (
    <Button variant="outline" size="icon" className="relative shrink-0">
      <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
      {unreadNotifications.length > 0 && (
        <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white animate-pulse">
          {unreadNotifications.length}
        </span>
      )}
      <span className="sr-only">Open notifications</span>
    </Button>
  );

  const notificationList = (
    <div className="space-y-3 p-1">
      {loading ? (
        <div className="flex items-center justify-center p-8 text-center">
          <div>
            <Bell className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600">Loading notifications...</p>
          </div>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-8">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-md font-semibold text-gray-800">No notifications yet</h3>
          <p className="text-sm text-gray-500">You're all caught up!</p>
        </div>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-3 rounded-lg border text-sm ${
              notification.read 
                ? 'bg-gray-50/50 border-gray-200/80' 
                : 'bg-blue-50/50 border-blue-200/80'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <User className="w-4 h-4 text-gray-500" />
                  <h4 className="font-semibold">{notification.title}</h4>
                  {!notification.read && (
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  )}
                </div>
                <p className="text-gray-600 mb-2">{notification.message}</p>
                <p className="text-xs text-gray-400">
                  {new Date(notification.created_at).toLocaleString()}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  deleteNotification(notification.id);
                }}
                className="h-8 w-8 p-0 text-gray-400 hover:text-red-600 ml-2"
                aria-label={`Delete notification: ${notification.title}`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            {notification.type === 'join_request' && !notification.read && (
              <div className="flex gap-2 mt-3">
                <Button
                  size="sm"
                  onClick={() => handleJoinRequest(notification.id, 'approve')}
                  className="bg-green-600 hover:bg-green-700 h-8"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleJoinRequest(notification.id, 'dismiss')}
                  className="h-8"
                >
                  <X className="w-4 h-4 mr-1" />
                  Dismiss
                </Button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader className="text-left">
            <DrawerTitle>Notifications</DrawerTitle>
            <DrawerDescription>{unreadNotifications.length > 0 ? `You have ${unreadNotifications.length} unread notifications.` : "You're all caught up."}</DrawerDescription>
          </DrawerHeader>
          <ScrollArea className="h-[70vh] w-full">
            {notificationList}
          </ScrollArea>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="p-4 border-b">
            <h4 className="font-medium leading-none">Notifications</h4>
            <p className="text-sm text-muted-foreground">{unreadNotifications.length > 0 ? `You have ${unreadNotifications.length} unread notifications.` : "You're all caught up."}</p>
        </div>
        <ScrollArea className="max-h-[60vh] w-full">
            {notificationList}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;
