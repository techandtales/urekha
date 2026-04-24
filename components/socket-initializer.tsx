"use client";

import { useEffect } from "react";
import { socket } from "@/lib/socketio/client";
import { toast } from "sonner";
import { useStore } from "@/lib/store";
import { v4 as uuidv4 } from "uuid";

export default function SocketInitializer() {
  const { setJyotishamData, jyotishamData } = useStore();

  useEffect(() => {
    // Connect to the socket server when the component mounts
    if (!socket.connected) {
      socket.connect();
    }

    // Connect to room on connection
    function handleRoomConnection() {
      // Connect to existing room or create a new one
      let currentRoom = jyotishamData.socketRoom;
      if (!currentRoom) {
        currentRoom = uuidv4();
        // Zustand state primitive update using category string 'socketRoom'
        setJyotishamData("socketRoom", currentRoom as any);
      }
      socket.emit("join-room", currentRoom);
    }

    // Setup listeners for prediction data
    const predictionTypes = [
      "health",
      "education",
      // "career",
      // "marriage",
      // "lifeanalysis",
    ];

    predictionTypes.forEach((type) => {
      socket.on(`predict-${type}`, (data: { status: string; data: string }) => {
        setJyotishamData(
          "predictions" as any,
          {
            [type]: { status: data.status, data: data.data },
          } as any,
        );
      });
    });

    // Optional: Log connection status
    function onConnect() {
      handleRoomConnection();
    }

    function onDisconnect() {
    }

    // Event Listeners
    function onYearlyPredictionCompleted(data: any) {
      toast.success("Yearly Prediction Completed!", {
        description: data?.message || "Your report is ready to view.",
        duration: 5000,
      });
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("yearly-prediction-completed", onYearlyPredictionCompleted);

    // If socket is already connected when component mounts, trigger room join
    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.off("connect");
      socket.off("disconnect", onDisconnect);
      socket.off("yearly-prediction-completed", onYearlyPredictionCompleted);

      predictionTypes.forEach((type) => {
        socket.off(`predict-${type}`);
      });
      // We do NOT disconnect here to keep the socket alive across navigations
    };
  }, [setJyotishamData, jyotishamData.socketRoom]); // Added dependencies

  return null; // This component renders nothing
}
