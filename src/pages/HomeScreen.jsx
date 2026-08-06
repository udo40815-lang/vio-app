import React from 'react';
import { gradientStyle, V } from '../utils/design-system.js';
import MissionCard from '../components/feed/MissionCard.jsx';
import OnboardingCard from '../components/feed/OnboardingCard.jsx';
import ValuePillars from '../components/feed/ValuePillars.jsx';
import PostCard from '../components/feed/PostCard.jsx';
import { UserPlus, Pencil, Search } from 'lucide-react';

function HomeScreen({ ui, posts }) {
  const feedPosts = (posts || []).slice(0, 5);
  return (
    <div className="px-4 pt-2 space-y-4">
      <MissionCard ui={ui} />
      {feedPosts.length === 0 ? (
        <div className="space-y-3">
          <OnboardingCard ui={ui} icon={UserPlus} title="Complete your profile" body="Add a bio and avatar so creators can discover you." color={V.royal} />
          <OnboardingCard ui={ui} icon={Pencil} title="Create your first post" body="Share your craft. Posts are ranked by value, not follower count." color={V.electric} />
          <OnboardingCard ui={ui} icon={Search} title="Discover creators" body="Explore the community and find creators that resonate with you." color={V.gold} />
          <ValuePillars ui={ui} />
        </div>
      ) : (
        feedPosts.map(post => <PostCard key={post.id} post={post} ui={ui} />)
      )}
    </div>
  );
}

export default HomeScreen;