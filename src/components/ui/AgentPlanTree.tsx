'use client';

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Circle,
  CircleAlert,
  CircleDotDashed,
  CircleX,
  Layers,
  ChevronDown,
  ChevronUp,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';

// Type definitions
export interface Subtask {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  tools?: string[]; // Optional array of MCP server tools
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  level: number;
  dependencies: string[];
  subtasks: Subtask[];
}

export interface AgentPlanTreeProps {
  tasks?: Task[];
  onTasksChange?: (tasks: Task[]) => void;
  title?: string;
  mode?: 'frontend' | 'fullstack' | 'prd' | string;
  compact?: boolean;
}

// Default initial tasks tailored for web applications
export const DEFAULT_STUDIO_TASKS: Task[] = [
  {
    id: "1",
    title: "Research Project Requirements",
    description: "Gather all necessary information about project scope, design system, and requirements",
    status: "completed",
    priority: "high",
    level: 0,
    dependencies: [],
    subtasks: [
      {
        id: "1.1",
        title: "Interview stakeholders & gather user personas",
        description: "Conduct interviews with key stakeholders to understand core business goals",
        status: "completed",
        priority: "high",
        tools: ["communication-agent", "meeting-scheduler"],
      },
      {
        id: "1.2",
        title: "Review existing documentation & assets",
        description: "Go through all available documentation and extract UI / database requirements",
        status: "completed",
        priority: "medium",
        tools: ["file-system", "browser"],
      },
      {
        id: "1.3",
        title: "Compile findings & acceptance criteria",
        description: "Create a comprehensive report of all gathered information",
        status: "completed",
        priority: "medium",
        tools: ["file-system", "markdown-processor"],
      },
    ],
  },
  {
    id: "2",
    title: "Design System Architecture",
    description: "Create the overall system architecture, state flow, and UI components",
    status: "in-progress",
    priority: "high",
    level: 0,
    dependencies: ["1"],
    subtasks: [
      {
        id: "2.1",
        title: "Define component structure & wireframes",
        description: "Map out all required layout components and their reactive interactions",
        status: "completed",
        priority: "high",
        tools: ["architecture-planner", "diagramming-tool"],
      },
      {
        id: "2.2",
        title: "Create data flow & state diagrams",
        description: "Design diagrams showing how data flows between UI and backend stores",
        status: "in-progress",
        priority: "medium",
        tools: ["diagramming-tool", "file-system"],
      },
      {
        id: "2.3",
        title: "Document API & schema specifications",
        description: "Write detailed specifications for all endpoints and in-memory tables",
        status: "pending",
        priority: "high",
        tools: ["api-designer", "openapi-generator"],
      },
    ],
  },
  {
    id: "3",
    title: "Implementation Planning & Sprints",
    description: "Create a detailed execution plan for implementing features and views",
    status: "pending",
    priority: "medium",
    level: 1,
    dependencies: ["1", "2"],
    subtasks: [
      {
        id: "3.1",
        title: "Resource & model allocation",
        description: "Determine required computational resources and allocate modules",
        status: "pending",
        priority: "medium",
        tools: ["project-manager", "resource-calculator"],
      },
      {
        id: "3.2",
        title: "Timeline & milestone development",
        description: "Create a timeline with milestones, live preview checkpoints, and release dates",
        status: "pending",
        priority: "high",
        tools: ["timeline-generator", "gantt-chart-creator"],
      },
      {
        id: "3.3",
        title: "Risk assessment & anti-slop verification",
        description: "Identify potential performance bottlenecks and visual regressions",
        status: "pending",
        priority: "medium",
        tools: ["risk-analyzer"],
      },
    ],
  },
  {
    id: "4",
    title: "Development Environment Setup",
    description: "Set up build system, Tailwind tokens, and hot-reload canvas preview",
    status: "completed",
    priority: "high",
    level: 0,
    dependencies: [],
    subtasks: [
      {
        id: "4.1",
        title: "Install development tools & dependencies",
        description: "Set up runtime packages, Lucide icons, and styling dependencies",
        status: "completed",
        priority: "high",
        tools: ["shell", "package-manager"],
      },
      {
        id: "4.2",
        title: "Configure live canvas pipeline",
        description: "Set up iframe sandbox and continuous code synthesis pipeline",
        status: "completed",
        priority: "medium",
        tools: ["github-actions", "gitlab-ci"],
      },
      {
        id: "4.3",
        title: "Set up automated test suite",
        description: "Configure automated validation and lint checks",
        status: "completed",
        priority: "high",
        tools: ["test-runner", "shell"],
      },
    ],
  },
  {
    id: "5",
    title: "Core Feature Synthesis & QA",
    description: "Generate responsive UI views, state controllers, and interactive logic",
    status: "in-progress",
    priority: "high",
    level: 1,
    dependencies: ["4"],
    subtasks: [
      {
        id: "5.1",
        title: "Implement core features & components",
        description: "Develop responsive views, navigation, filtering, and data tables",
        status: "in-progress",
        priority: "high",
        tools: ["code-assistant", "github", "file-system", "shell"],
      },
      {
        id: "5.2",
        title: "Perform unit & visual testing",
        description: "Validate responsive breakpoints, dark/light contrast, and user flows",
        status: "pending",
        priority: "medium",
        tools: ["test-runner", "code-coverage-analyzer"],
      },
      {
        id: "5.3",
        title: "Document code & export deliverables",
        description: "Create clear documentation and export production ready artifacts",
        status: "pending",
        priority: "low",
        tools: ["documentation-generator", "markdown-processor"],
      },
    ],
  },
];

export default function AgentPlanTree({
  tasks: customTasks,
  onTasksChange,
  title = "Plan & Task Execution Breakdown",
  mode,
  compact = false
}: AgentPlanTreeProps) {
  const [tasks, setTasks] = useState<Task[]>(customTasks || DEFAULT_STUDIO_TASKS);
  const [expandedTasks, setExpandedTasks] = useState<string[]>(["1", "2"]);
  const [expandedSubtasks, setExpandedSubtasks] = useState<{ [key: string]: boolean }>({});
  
  // Sync when custom tasks change
  useEffect(() => {
    if (customTasks && customTasks.length > 0) {
      setTasks(customTasks);
    }
  }, [customTasks]);

  // Support reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  // Toggle task expansion
  const toggleTaskExpansion = (taskId: string) => {
    setExpandedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId],
    );
  };

  // Toggle subtask expansion
  const toggleSubtaskExpansion = (taskId: string, subtaskId: string) => {
    const key = `${taskId}-${subtaskId}`;
    setExpandedSubtasks((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Toggle task status
  const toggleTaskStatus = (taskId: string) => {
    setTasks((prev) => {
      const updated = prev.map((task) => {
        if (task.id === taskId) {
          const statuses = ["completed", "in-progress", "pending", "need-help", "failed"];
          const currentIdx = statuses.indexOf(task.status);
          const newStatus = statuses[(currentIdx + 1) % statuses.length];

          const updatedSubtasks = task.subtasks.map((subtask) => ({
            ...subtask,
            status: newStatus === "completed" ? "completed" : subtask.status,
          }));

          return {
            ...task,
            status: newStatus,
            subtasks: updatedSubtasks,
          };
        }
        return task;
      });

      if (onTasksChange) onTasksChange(updated);
      return updated;
    });
  };

  // Toggle subtask status
  const toggleSubtaskStatus = (taskId: string, subtaskId: string) => {
    setTasks((prev) => {
      const updated = prev.map((task) => {
        if (task.id === taskId) {
          const updatedSubtasks = task.subtasks.map((subtask) => {
            if (subtask.id === subtaskId) {
              const newStatus =
                subtask.status === "completed" ? "pending" : "completed";
              return { ...subtask, status: newStatus };
            }
            return subtask;
          });

          const allSubtasksCompleted = updatedSubtasks.every(
            (s) => s.status === "completed",
          );

          return {
            ...task,
            subtasks: updatedSubtasks,
            status: allSubtasksCompleted ? "completed" : task.status,
          };
        }
        return task;
      });

      if (onTasksChange) onTasksChange(updated);
      return updated;
    });
  };

  // Count stats
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const totalTasks = tasks.length;
  const progressPercent = Math.round((completedTasks / (totalTasks || 1)) * 100);

  // Animation variants
  const taskVariants = {
    hidden: { 
      opacity: 0, 
      y: prefersReducedMotion ? 0 : -5 
    },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: prefersReducedMotion ? "tween" : "spring", 
        stiffness: 500, 
        damping: 30,
        duration: prefersReducedMotion ? 0.2 : undefined
      }
    },
    exit: {
      opacity: 0,
      y: prefersReducedMotion ? 0 : -5,
      transition: { duration: 0.15 }
    }
  };

  const subtaskListVariants = {
    hidden: { 
      opacity: 0, 
      height: 0,
      overflow: "hidden" 
    },
    visible: { 
      height: "auto", 
      opacity: 1,
      overflow: "visible",
      transition: { 
        duration: 0.25, 
        staggerChildren: prefersReducedMotion ? 0 : 0.05,
        when: "beforeChildren",
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    },
    exit: {
      height: 0,
      opacity: 0,
      overflow: "hidden",
      transition: { 
        duration: 0.2,
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    }
  };

  const subtaskVariants = {
    hidden: { 
      opacity: 0, 
      x: prefersReducedMotion ? 0 : -10 
    },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        type: prefersReducedMotion ? "tween" : "spring", 
        stiffness: 500, 
        damping: 25,
        duration: prefersReducedMotion ? 0.2 : undefined
      }
    },
    exit: {
      opacity: 0,
      x: prefersReducedMotion ? 0 : -10,
      transition: { duration: 0.15 }
    }
  };

  const subtaskDetailsVariants = {
    hidden: { 
      opacity: 0, 
      height: 0,
      overflow: "hidden"
    },
    visible: { 
      opacity: 1, 
      height: "auto",
      overflow: "visible",
      transition: { 
        duration: 0.25,
        ease: [0.2, 0.65, 0.3, 0.9]
      }
    }
  };

  const statusBadgeVariants = {
    initial: { scale: 1 },
    animate: { 
      scale: prefersReducedMotion ? 1 : [1, 1.08, 1],
      transition: { 
        duration: 0.35,
        ease: [0.34, 1.56, 0.64, 1]
      }
    }
  };

  return (
    <div className={`w-full text-zinc-200 ${compact ? 'text-xs' : 'text-sm'}`}>
      <motion.div 
        className="bg-zinc-950/80 border border-zinc-800/80 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ 
          opacity: 1, 
          y: 0,
          transition: {
            duration: 0.3,
            ease: [0.2, 0.65, 0.3, 0.9]
          }
        }}
      >
        {/* Header Summary Bar */}
        <div className="px-3.5 py-2.5 border-b border-zinc-800/80 bg-zinc-900/60 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400 flex items-center justify-center shrink-0">
              <Layers className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <h4 className="font-semibold text-xs text-white truncate tracking-tight">
                {title}
              </h4>
              <div className="text-[10px] text-zinc-400 flex items-center gap-1.5">
                <span>{completedTasks}/{totalTasks} Task Selesai</span>
                <span className="text-zinc-600">•</span>
                <span className="text-emerald-400 font-mono font-medium">{progressPercent}%</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => {
                if (expandedTasks.length === tasks.length) {
                  setExpandedTasks([]);
                } else {
                  setExpandedTasks(tasks.map(t => t.id));
                }
              }}
              className="px-2 py-1 rounded-md bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white text-[10px] font-medium transition-colors flex items-center gap-1 border border-zinc-700/50 cursor-pointer"
            >
              {expandedTasks.length === tasks.length ? (
                <>
                  <ChevronUp className="w-3 h-3" />
                  <span>Ciutkan</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3 h-3" />
                  <span>Buka Semua</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Task List Items */}
        <LayoutGroup>
          <div className="p-3 sm:p-3.5">
            <ul className="space-y-1.5">
              {tasks.map((task, index) => {
                const isExpanded = expandedTasks.includes(task.id);
                const isCompleted = task.status === "completed";

                return (
                  <motion.li
                    key={task.id}
                    className={`${index !== 0 ? "pt-1 border-t border-zinc-800/40" : ""}`}
                    initial="hidden"
                    animate="visible"
                    variants={taskVariants}
                  >
                    {/* Task row */}
                    <motion.div 
                      className="group flex items-center px-2.5 py-1.5 rounded-xl hover:bg-zinc-900/60 transition-colors"
                    >
                      {/* Status Icon */}
                      <motion.div
                        className="mr-2 flex-shrink-0 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTaskStatus(task.id);
                        }}
                        whileTap={{ scale: 0.9 }}
                        whileHover={{ scale: 1.1 }}
                        title="Klik untuk ubah status"
                      >
                        <AnimatePresence mode="wait">
                          <motion.div
                            key={task.status}
                            initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                            transition={{
                              duration: 0.2,
                              ease: [0.2, 0.65, 0.3, 0.9]
                            }}
                          >
                            {task.status === "completed" ? (
                              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            ) : task.status === "in-progress" ? (
                              <CircleDotDashed className="h-4 w-4 text-blue-400" />
                            ) : task.status === "need-help" ? (
                              <CircleAlert className="h-4 w-4 text-amber-400" />
                            ) : task.status === "failed" ? (
                              <CircleX className="h-4 w-4 text-rose-400" />
                            ) : (
                              <Circle className="text-zinc-600 h-4 w-4" />
                            )}
                          </motion.div>
                        </AnimatePresence>
                      </motion.div>

                      {/* Title & metadata */}
                      <motion.div
                        className="flex min-w-0 flex-grow cursor-pointer items-center justify-between gap-2"
                        onClick={() => toggleTaskExpansion(task.id)}
                      >
                        <div className="mr-2 flex-1 truncate">
                          <span
                            className={`text-xs font-medium ${
                              isCompleted
                                ? "text-zinc-500 line-through"
                                : "text-zinc-200 group-hover:text-white"
                            }`}
                          >
                            {task.title}
                          </span>
                        </div>

                        <div className="flex flex-shrink-0 items-center space-x-1.5 text-xs">
                          {task.dependencies && task.dependencies.length > 0 && (
                            <div className="flex items-center">
                              <div className="flex flex-wrap gap-1">
                                {task.dependencies.map((dep, idx) => (
                                  <motion.span
                                    key={idx}
                                    className="bg-zinc-800 text-zinc-400 border border-zinc-700/60 rounded px-1.5 py-0.2 text-[9px] font-mono"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{
                                      duration: 0.2,
                                      delay: idx * 0.05
                                    }}
                                  >
                                    Dep #{dep}
                                  </motion.span>
                                ))}
                              </div>
                            </div>
                          )}

                          <motion.span
                            className={`rounded px-1.5 py-0.5 text-[10px] font-bold border uppercase font-mono tracking-wider ${
                              task.status === "completed"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : task.status === "in-progress"
                                  ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                                  : task.status === "need-help"
                                    ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                    : task.status === "failed"
                                      ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                      : "bg-zinc-800/80 text-zinc-400 border-zinc-700/50"
                            }`}
                            variants={statusBadgeVariants}
                            initial="initial"
                            animate="animate"
                            key={task.status}
                          >
                            {task.status}
                          </motion.span>
                        </div>
                      </motion.div>
                    </motion.div>

                    {/* Subtasks Tree Hierarchy */}
                    <AnimatePresence mode="wait">
                      {isExpanded && task.subtasks && task.subtasks.length > 0 && (
                        <motion.div 
                          className="relative overflow-hidden pl-4 pr-1"
                          variants={subtaskListVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                          layout
                        >
                          {/* Vertical connecting line */}
                          <div className="absolute top-0 bottom-0 left-[18px] border-l border-dashed border-zinc-800" />
                          
                          <ul className="mt-1 space-y-1 pl-2">
                            {task.subtasks.map((subtask) => {
                              const subtaskKey = `${task.id}-${subtask.id}`;
                              const isSubtaskExpanded = expandedSubtasks[subtaskKey];

                              return (
                                <motion.li
                                  key={subtask.id}
                                  className="group/sub flex flex-col py-0.5"
                                  onClick={() => toggleSubtaskExpansion(task.id, subtask.id)}
                                  variants={subtaskVariants}
                                  initial="hidden"
                                  animate="visible"
                                  exit="exit"
                                  layout
                                >
                                  <motion.div 
                                    className="flex flex-1 items-center rounded-lg px-2 py-1 hover:bg-zinc-900/40 transition-colors"
                                    layout
                                  >
                                    <motion.div
                                      className="mr-2 flex-shrink-0 cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleSubtaskStatus(task.id, subtask.id);
                                      }}
                                      whileTap={{ scale: 0.9 }}
                                      whileHover={{ scale: 1.1 }}
                                      layout
                                    >
                                      <AnimatePresence mode="wait">
                                        <motion.div
                                          key={subtask.status}
                                          initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                                          exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                                          transition={{
                                            duration: 0.2,
                                            ease: [0.2, 0.65, 0.3, 0.9]
                                          }}
                                        >
                                          {subtask.status === "completed" ? (
                                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                                          ) : subtask.status === "in-progress" ? (
                                            <CircleDotDashed className="h-3.5 w-3.5 text-blue-400" />
                                          ) : subtask.status === "need-help" ? (
                                            <CircleAlert className="h-3.5 w-3.5 text-amber-400" />
                                          ) : subtask.status === "failed" ? (
                                            <CircleX className="h-3.5 w-3.5 text-rose-400" />
                                          ) : (
                                            <Circle className="text-zinc-600 h-3.5 w-3.5" />
                                          )}
                                        </motion.div>
                                      </AnimatePresence>
                                    </motion.div>

                                    <span
                                      className={`cursor-pointer text-[11px] ${
                                        subtask.status === "completed"
                                          ? "text-zinc-500 line-through"
                                          : "text-zinc-300 group-hover/sub:text-zinc-100"
                                      }`}
                                    >
                                      {subtask.title}
                                    </span>
                                  </motion.div>

                                  {/* Subtask Details / Description & MCP tools */}
                                  <AnimatePresence mode="wait">
                                    {isSubtaskExpanded && (
                                      <motion.div 
                                        className="text-zinc-400 border-zinc-800 mt-1 ml-3 border-l border-dashed pl-4 text-[10px] overflow-hidden bg-zinc-900/30 p-2 rounded-r-lg"
                                        variants={subtaskDetailsVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="hidden"
                                        layout
                                      >
                                        <p className="py-0.5 leading-relaxed text-zinc-300">{subtask.description}</p>
                                        {subtask.tools && subtask.tools.length > 0 && (
                                          <div className="mt-1 flex flex-wrap items-center gap-1.5">
                                            <span className="text-zinc-500 font-medium flex items-center gap-1">
                                              <Cpu className="w-2.5 h-2.5 text-blue-400" />
                                              <span>Tools / MCP:</span>
                                            </span>
                                            <div className="flex flex-wrap gap-1">
                                              {subtask.tools.map((tool, idx) => (
                                                <motion.span
                                                  key={idx}
                                                  className="bg-zinc-800 text-blue-300 border border-blue-500/20 rounded px-1.5 py-0.5 text-[9px] font-mono"
                                                  initial={{ opacity: 0, y: -5 }}
                                                  animate={{ 
                                                    opacity: 1, 
                                                    y: 0,
                                                    transition: {
                                                      duration: 0.2,
                                                      delay: idx * 0.05
                                                    }
                                                  }}
                                                >
                                                  {tool}
                                                </motion.span>
                                              ))}
                                            </div>
                                          </div>
                                        )}
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </motion.li>
                              );
                            })}
                          </ul>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.li>
                );
              })}
            </ul>
          </div>
        </LayoutGroup>
      </motion.div>
    </div>
  );
}
export { AgentPlanTree as Plan };
