import * as React from "react";
import { ServerMessage } from "../../../types";

interface InspectorProps {
  selectedAgent: string | null;
  selectedRoom: string | null;
  agents: any[];
  rooms: any[];
  logs: ServerMessage[];
}

export function Inspector({
  selectedAgent,
  selectedRoom,
  agents,
  rooms,
  logs,
}: InspectorProps) {
  const agent = agents.find((a) => a.name === selectedAgent);
  const room = rooms.find((r) => r.id === selectedRoom);

  if (!agent && !room) {
    return (
      <div className="h-full flex flex-col">
        <div className="px-2 h-8 flex items-center border-b border-cyan-900/30">
          <h2 className="text-emerald-400">
            <span className="text-gray-500">INS:</span> INSPECTOR
          </h2>
        </div>
        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm">
          Select an agent or room to inspect
        </div>
      </div>
    );
  }

  if (room) {
    return (
      <div className="h-full flex flex-col">
        <div className="px-2 h-8 flex items-center border-b border-cyan-900/30">
          <h2 className="text-emerald-400">
            <span className="text-gray-500">INS:</span> {room.name}
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {/* Room Details */}
          <div className="p-2 border-b border-cyan-900/30">
            <div className="text-xs text-gray-500 mb-1">Type</div>
            <div className="text-sm text-cyan-400">{room.type}</div>
          </div>

          {/* Room Description */}
          <div className="p-2 border-b border-cyan-900/30">
            <div className="text-xs text-gray-500 mb-1">Description</div>
            <div className="text-sm text-cyan-400">{room.description}</div>
          </div>

          {/* Occupants */}
          <div className="p-2 border-b border-cyan-900/30">
            <div className="text-xs text-gray-500 mb-1">Present Agents</div>
            <div className="space-y-1">
              {room.occupants?.map((agentId: number) => {
                const agent = agents.find((a) => a.id === agentId);
                return (
                  <div
                    key={agentId}
                    className="text-sm flex items-center gap-2"
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        agent?.active ? "bg-emerald-400" : "bg-red-400"
                      }`}
                    />
                    <span className="text-cyan-400">{agent?.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="p-2">
            <div className="text-xs text-gray-500 mb-1">Recent Activity</div>
            <div className="space-y-1">
              {logs
                .filter((log) => {
                  if (log.type !== "AGENT_STATE" && log.type !== "ROOM_STATE")
                    return false;
                  if (log.type === "ROOM_STATE")
                    return log.data.roomId === room.id;
                  return log.data.agentId === selectedAgent;
                })
                .slice(-5)
                .map((log, i) => {
                  if (log.type === "AGENT_STATE") {
                    return (
                      <div key={i} className="text-sm text-gray-400">
                        {log.data.thought || log.data.action?.type}
                      </div>
                    );
                  }
                  if (log.type === "ROOM_STATE") {
                    return (
                      <div key={i} className="text-sm text-gray-400">
                        {log.data.event}
                      </div>
                    );
                  }
                  return null;
                })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="px-2 h-8 flex items-center border-b border-cyan-900/30">
        <h2 className="text-emerald-400">
          <span className="text-gray-500">INS:</span> {agent.name}
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {/* Agent Details */}
        <div className="p-2 border-b border-cyan-900/30">
          <div className="text-xs text-gray-500 mb-1">Role</div>
          <div className="text-sm text-cyan-400">{agent.role}</div>
        </div>

        {/* Agent Description */}
        <div className="p-2 border-b border-cyan-900/30">
          <div className="text-xs text-gray-500 mb-1">Description</div>
          <div className="text-sm text-cyan-400">
            {agent.description || "No description available"}
          </div>
        </div>

        {/* Agent Appearance */}
        <div className="p-2 border-b border-cyan-900/30">
          <div className="text-xs text-gray-500 mb-1 flex items-center justify-between">
            <span>Appearance</span>
            {agent.lastUpdate && (
              <span className="text-emerald-400 text-[10px]">
                {Math.round((Date.now() - agent.lastUpdate) / 1000)}s ago
              </span>
            )}
          </div>
          <div className="text-sm text-cyan-400 space-y-2">
            {agent.appearance && <div>{agent.appearance}</div>}
            {agent.facialExpression && (
              <div className="flex items-start gap-2">
                <span className="text-gray-500 text-xs">Expression:</span>
                <span className="flex-1">{agent.facialExpression}</span>
              </div>
            )}
            {agent.bodyLanguage && (
              <div className="flex items-start gap-2">
                <span className="text-gray-500 text-xs">Body Language:</span>
                <span className="flex-1">{agent.bodyLanguage}</span>
              </div>
            )}
            {agent.currentAction && (
              <div className="flex items-start gap-2">
                <span className="text-gray-500 text-xs">Action:</span>
                <span className="flex-1">{agent.currentAction}</span>
              </div>
            )}
            {agent.socialCues && (
              <div className="flex items-start gap-2">
                <span className="text-gray-500 text-xs">Social Cues:</span>
                <span className="flex-1">{agent.socialCues}</span>
              </div>
            )}
          </div>
        </div>

        {/* Current State */}
        <div className="p-2 border-b border-cyan-900/30">
          <div className="text-xs text-gray-500 mb-1">State</div>
          <div className="text-sm">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  agent.active ? "bg-emerald-400" : "bg-red-400"
                }`}
              />
              <span className="text-cyan-400">
                {agent.active ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        {/* Last Thought */}
        <div className="p-2 border-b border-cyan-900/30">
          <div className="text-xs text-gray-500 mb-1">Last Thought</div>
          <div className="text-sm text-cyan-400">
            {agent.lastThought || "No thoughts yet"}
          </div>
        </div>

        {/* Recent Experiences */}
        <div className="p-2">
          <div className="text-xs text-gray-500 mb-1">Recent Experiences</div>
          <div className="space-y-1">
            {(agent.experiences || []).slice(-5).map((exp: any, i: number) => (
              <div key={i} className="text-sm text-gray-400">
                {exp.content}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
