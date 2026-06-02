import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, GripVertical } from "lucide-react";
import ToolCard from "./ToolCard";
import ToolInfo from "./ToolInfo";

interface Story {
  id: number;
  name: string;
  notes: string;
  priority: number;
}

interface Activity {
  id: number;
  name: string;
  stories: Story[];
}

let nextActivityId = 1;
let nextStoryId = 1;

const UserStoryMap = () => {
  const [activities, setActivities] = useState<Activity[]>([
    {
      id: nextActivityId++,
      name: "User Registration",
      stories: [
        { id: nextStoryId++, name: "Enter email & password", notes: "", priority: 1 },
        { id: nextStoryId++, name: "Verify email address", notes: "", priority: 2 },
        { id: nextStoryId++, name: "Social login (Google/Apple)", notes: "", priority: 3 },
      ],
    },
    {
      id: nextActivityId++,
      name: "Content Browsing",
      stories: [
        { id: nextStoryId++, name: "Browse homepage feed", notes: "", priority: 1 },
        { id: nextStoryId++, name: "Search by keyword", notes: "", priority: 2 },
        { id: nextStoryId++, name: "Filter by category", notes: "", priority: 3 },
      ],
    },
  ]);

  const addActivity = () => {
    const num = activities.length + 1;
    setActivities((prev) => [
      ...prev,
      { id: nextActivityId++, name: `Activity ${num}`, stories: [] },
    ]);
  };

  const removeActivity = (id: number) => {
    if (activities.length <= 1) return;
    setActivities((prev) => prev.filter((a) => a.id !== id));
  };

  const updateActivityName = (id: number, name: string) => {
    setActivities((prev) => prev.map((a) => (a.id === id ? { ...a, name } : a)));
  };

  const addStory = (activityId: number) => {
    setActivities((prev) =>
      prev.map((a) =>
        a.id === activityId
          ? { ...a, stories: [...a.stories, { id: nextStoryId++, name: "", notes: "", priority: a.stories.length + 1 }] }
          : a
      )
    );
  };

  const removeStory = (activityId: number, storyId: number) => {
    setActivities((prev) =>
      prev.map((a) =>
        a.id === activityId
          ? { ...a, stories: a.stories.filter((s) => s.id !== storyId) }
          : a
      )
    );
  };

  const updateStory = (activityId: number, storyId: number, field: "name" | "notes", value: string) => {
    setActivities((prev) =>
      prev.map((a) =>
        a.id === activityId
          ? { ...a, stories: a.stories.map((s) => (s.id === storyId ? { ...s, [field]: value } : s)) }
          : a
      )
    );
  };

  const totalStories = useMemo(
    () => activities.reduce((sum, a) => sum + a.stories.length, 0),
    [activities]
  );

  return (
    <ToolCard
      title="User Story Map"
      subtitle="Visualise the user journey across activities and organise stories by priority for release planning."
    >
      <ToolInfo
        what="User Story Mapping, popularised by Jeff Patton, is a collaborative exercise that arranges user stories along two dimensions: the horizontal backbone (user activities in chronological order) and the vertical priority (stories sliced into release increments)."
        why="Use it during discovery or release planning to get a bird's-eye view of the product, identify gaps, and plan Minimum Viable Products (MVPs). It prevents teams from building features in isolation without understanding the full user journey."
        how="1. Identify user activities (the backbone — what the user does). 2. Break each activity into specific user stories. 3. Arrange stories vertically by priority (high-priority at the top). 4. Draw a release cut line — everything above goes into the next release. 5. Use the map to spot dependencies, gaps, and opportunities."
      />

      {/* Legend */}
      <div className="glass-card p-4 md:p-5">
        <div className="flex items-center gap-4 text-[11px] font-sans text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-gold/20 border border-gold/40" />
            <span>Activity (backbone)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded bg-background border border-border/50" />
            <span>User story</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-muted-foreground/50">← High priority</span>
          </div>
        </div>
      </div>

      {/* Story Map */}
      <div className="glass-card p-5 md:p-6 space-y-6 overflow-x-auto">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-semibold text-foreground text-sm shrink-0">
            Story Map
          </h2>
          <button
            onClick={addActivity}
            className="flex items-center gap-1 text-xs font-medium text-gold-dark hover:text-gold transition-colors font-sans shrink-0"
          >
            <Plus size={14} /> Add Activity
          </button>
        </div>

        <div className="flex gap-4 min-w-max pb-2">
          {activities.map((activity) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col gap-1.5 min-w-[180px] max-w-[220px]"
            >
              {/* Activity header */}
              <div className="bg-gold/10 border border-gold/30 rounded-lg p-2.5">
                <div className="flex items-center gap-1.5">
                  <GripVertical size={12} className="text-muted-foreground/30 shrink-0" />
                  <input
                    type="text"
                    value={activity.name}
                    onChange={(e) => updateActivityName(activity.id, e.target.value)}
                    className="flex-1 bg-transparent text-xs font-semibold text-foreground font-sans border-b border-transparent focus:border-gold/50 focus:outline-none transition-colors"
                  />
                  <button
                    onClick={() => removeActivity(activity.id)}
                    className="text-muted-foreground/30 hover:text-red-400 transition-colors shrink-0"
                    aria-label="Remove activity"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
                <button
                  onClick={() => addStory(activity.id)}
                  className="flex items-center gap-1 text-[10px] text-muted-foreground/50 hover:text-gold-dark transition-colors font-sans mt-1.5"
                >
                  <Plus size={10} /> Add story
                </button>
              </div>

              {/* Stories */}
              <div className="flex flex-col gap-1">
                {activity.stories
                  .sort((a, b) => a.priority - b.priority)
                  .map((story, si) => (
                    <motion.div
                      key={story.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-background border border-border/40 rounded-lg p-2 group"
                    >
                      <div className="flex items-start gap-1">
                        <span className="text-[9px] text-muted-foreground/40 font-mono mt-0.5 shrink-0">
                          {si + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <input
                            type="text"
                            value={story.name}
                            onChange={(e) => updateStory(activity.id, story.id, "name", e.target.value)}
                            className="w-full bg-transparent text-[11px] text-foreground font-sans border-b border-transparent focus:border-gold/50 focus:outline-none transition-colors placeholder:text-muted-foreground/40"
                            placeholder="Story description"
                          />
                          <input
                            type="text"
                            value={story.notes}
                            onChange={(e) => updateStory(activity.id, story.id, "notes", e.target.value)}
                            className="w-full bg-transparent text-[9px] text-muted-foreground/50 font-sans mt-0.5 border-b border-transparent focus:border-gold/30 focus:outline-none transition-colors placeholder:text-muted-foreground/20"
                            placeholder="Notes (optional)"
                          />
                        </div>
                        <button
                          onClick={() => removeStory(activity.id, story.id)}
                          className="text-muted-foreground/20 hover:text-red-400 transition-colors shrink-0 opacity-0 group-hover:opacity-100"
                          aria-label="Remove story"
                        >
                          <Trash2 size={10} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card-strong p-5 md:p-6"
      >
        <h2 className="font-serif font-semibold text-foreground text-sm mb-3">Map Summary</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="text-center p-3 rounded-lg bg-background/50">
            <p className="text-2xl font-serif font-bold text-foreground">{activities.length}</p>
            <p className="text-[10px] text-muted-foreground/50 font-sans">Activities</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-background/50">
            <p className="text-2xl font-serif font-bold text-foreground">{totalStories}</p>
            <p className="text-[10px] text-muted-foreground/50 font-sans">User Stories</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-background/50">
            <p className="text-2xl font-serif font-bold text-foreground">
              {activities.filter((a) => a.stories.length > 0).length}
            </p>
            <p className="text-[10px] text-muted-foreground/50 font-sans">With Stories</p>
          </div>
          <div className="text-center p-3 rounded-lg bg-background/50">
            <p className="text-2xl font-serif font-bold text-foreground">
              {totalStories > 0
                ? (totalStories / activities.length).toFixed(1)
                : "—"}
            </p>
            <p className="text-[10px] text-muted-foreground/50 font-sans">Avg Stories/Activity</p>
          </div>
        </div>
      </motion.div>

      <p className="text-center text-[10px] uppercase tracking-[0.25em] text-muted-foreground/30 font-sans pt-4">
        Built by Syed Imon Rizvi — Qalb Studios
      </p>
    </ToolCard>
  );
};

export default UserStoryMap;
