"use client";

import { useEffect, useState } from "react";
import { socket } from "@/lib/socketio/client";
import { API_BASE_URL } from "@/lib/config/api";

export default function SocketTestPage() {
  const [isConnected, setIsConnected] = useState(false);
  const [transport, setTransport] = useState("N/A");
  const [socketId, setSocketId] = useState<string | null>(null);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      setIsConnected(true);
      setTransport(socket.io.engine.transport.name);
      setSocketId(socket.id || null);

      socket.io.engine.on("upgrade", (transport) => {
        setTransport(transport.name);
      });
    }

    function onDisconnect() {
      setIsConnected(false);
      setTransport("N/A");
      setSocketId(null);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    // Connect manually if not auto-connected
    socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white text-center">
          Socket.IO Connection Test
        </h1>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Status:</span>
            <span
              className={`px-3 py-1 rounded-full text-sm font-semibold ${
                isConnected
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Socket ID:</span>
            <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded text-sm text-gray-800 dark:text-gray-200">
              {socketId || "None"}
            </code>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 dark:text-gray-300">Transport:</span>
            <span className="text-gray-800 dark:text-gray-200 font-medium">
              {transport}
            </span>
          </div>

          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-center text-gray-500">
              Target Server:{" "}
              {API_BASE_URL}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
