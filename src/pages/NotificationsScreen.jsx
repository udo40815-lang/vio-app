import React from 'react';
import { Bell, Heart, MessageCircle, UserPlus, Check } from 'lucide-react';
import { V, timeAgo } from '../utils/design-system.js';
import EmptyState from '../components/ui/EmptyState.jsx';
import Avatar from '../components/ui/Avatar.jsx';

function NotificationsScreen({ ui }) {
  return (
    <div className="px-4 pt-2 space-y-4">
      <EmptyState ui={ui} icon={Bell} title="No notifications" body="When someone likes, comments, or follows you, it will show up here." />
    </div>
  );
}

export default NotificationsScreen;