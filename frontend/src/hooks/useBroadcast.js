import { useEffect, useRef, useCallback } from "react";
import { useSocket } from "../context/SocketContext";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

const useBroadcast = (streamId, videoRef) => {
  const socket = useSocket();
  const peersRef = useRef({});
  const localStreamRef = useRef(null);

  const startBroadcast = useCallback(async (useScreenShare = false) => {
    try {
      let stream;

      if (useScreenShare) {
        stream = await navigator.mediaDevices.getDisplayMedia({
          video: { width: 1280, height: 720 },
          audio: true,
        });

        stream.getVideoTracks()[0].onended = () => {
          stopBroadcast();
        };
      } else {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 1280, height: 720 },
          audio: true,
        });
      }

      localStreamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
      }

      socket.emit("join-stream", { streamId, role: "broadcaster" });

      return stream;
    } catch (err) {
      console.error("Failed to access media:", err);
      if (useScreenShare) {
        throw new Error("Could not access screen sharing. Please check permissions.");
      } else {
        throw new Error("Could not access camera or microphone. Please check permissions.");
      }
    }
  }, [socket, streamId, videoRef]);

  const createPeerForViewer = useCallback(
    async (viewerId) => {
      const peer = new RTCPeerConnection(ICE_SERVERS);
      peersRef.current[viewerId] = peer;

      localStreamRef.current.getTracks().forEach((track) => {
        peer.addTrack(track, localStreamRef.current);
      });

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            candidate: event.candidate,
            targetId: viewerId,
          });
        }
      };

      const offer = await peer.createOffer();
      await peer.setLocalDescription(offer);

      socket.emit("webrtc-offer", { offer, viewerId });
    },
    [socket]
  );

  const toggleScreenShare = useCallback(async () => {
    const isCurrentlyScreenSharing = localStreamRef.current?.getVideoTracks()[0]?.getSettings().displaySurface !== undefined;

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
    }

    try {
      await startBroadcast(!isCurrentlyScreenSharing);
    } catch (err) {
      console.error("Failed to toggle screen share:", err);
      throw err;
    }
  }, [startBroadcast]);

  const stopBroadcast = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    Object.values(peersRef.current).forEach((peer) => peer.close());
    peersRef.current = {};

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [videoRef]);

  useEffect(() => {
    if (!socket) return;

    const handleViewerJoined = ({ viewerId }) => {
      console.log("👀 New viewer joined:", viewerId);
      createPeerForViewer(viewerId);
    };

    const handleAnswer = async ({ answer, viewerId }) => {
      const peer = peersRef.current[viewerId];
      if (peer) {
        await peer.setRemoteDescription(new RTCSessionDescription(answer));
      }
    };

    const handleIceCandidate = ({ candidate, fromId }) => {
      const peer = peersRef.current[fromId];
      if (peer && candidate) {
        peer.addIceCandidate(new RTCIceCandidate(candidate));
      }
    };

    const handleViewerLeft = ({ viewerId }) => {
      const peer = peersRef.current[viewerId];
      if (peer) {
        peer.close();
        delete peersRef.current[viewerId];
      }
    };

    socket.on("viewer-joined", handleViewerJoined);
    socket.on("webrtc-answer", handleAnswer);
    socket.on("ice-candidate", handleIceCandidate);
    socket.on("viewer-left", handleViewerLeft);

    return () => {
      socket.off("viewer-joined", handleViewerJoined);
      socket.off("webrtc-answer", handleAnswer);
      socket.off("ice-candidate", handleIceCandidate);
      socket.off("viewer-left", handleViewerLeft);
    };
  }, [socket, createPeerForViewer]);

  return { startBroadcast, stopBroadcast, toggleScreenShare };
};

export default useBroadcast;
