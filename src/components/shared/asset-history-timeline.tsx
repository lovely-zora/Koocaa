"use client";

import { format } from "date-fns";
import { Calendar, User, Wrench, ArrowRightLeft, CheckCircle } from "lucide-react";

interface HistoryEvent {
  id: string;
  type: "assigned" | "returned" | "maintenance" | "updated";
  title: string;
  description?: string;
  date: Date;
  user?: string;
  details?: string;
}

interface AssetHistoryTimelineProps {
  history: HistoryEvent[];
  className?: string;
}

const iconMap = {
  assigned: <User className="h-4 w-4 text-blue-600" />,
  returned: <ArrowRightLeft className="h-4 w-4 text-orange-600" />,
  maintenance: <Wrench className="h-4 w-4 text-amber-600" />,
  updated: <CheckCircle className="h-4 w-4 text-green-600" />,
};

const colorMap = {
  assigned: "bg-blue-100 text-blue-700 border-blue-200",
  returned: "bg-orange-100 text-orange-700 border-orange-200",
  maintenance: "bg-amber-100 text-amber-700 border-amber-200",
  updated: "bg-green-100 text-green-700 border-green-200",
};

export function AssetHistoryTimeline({ history, className }: AssetHistoryTimelineProps) {
  if (history.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Calendar className="mx-auto h-10 w-10 mb-3 opacity-40" />
        <p>No history available yet</p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-sm font-medium flex items-center gap-2">
        <Calendar className="h-4 w-4" />
        Asset History Timeline
      </div>

      <div className="relative border-l border-border pl-6 ml-3 space-y-8">
        {history.map((event, index) => (
          <div key={event.id} className="relative">
            {/* Timeline Dot */}
            <div className="absolute -left-[6.5px] top-1.5 h-3 w-3 rounded-full border-2 border-background bg-muted-foreground" />

            <div className="flex gap-4">
              {/* Icon */}
              <div className="mt-0.5">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                  {iconMap[event.type]}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colorMap[event.type]}`}>
                      {event.type.toUpperCase()}
                    </span>
                    <span className="ml-2 text-sm font-medium">{event.title}</span>
                  </div>
                  <time className="text-xs text-muted-foreground">
                    {format(event.date, "dd MMM yyyy • HH:mm")}
                  </time>
                </div>

                {event.description && (
                  <p className="text-sm text-muted-foreground">{event.description}</p>
                )}

                {event.user && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    {event.user}
                  </div>
                )}

                {event.details && (
                  <p className="text-xs bg-muted/50 p-2 rounded border">
                    {event.details}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
