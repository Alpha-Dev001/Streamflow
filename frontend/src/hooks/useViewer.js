import { useEffect, useRef, useCallback } from "react";
import { useSocket } from "../context/SocketContext";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
  ],
};

const useViewer = (streamId, videoRef) => {
  const socket = useSocket();
  const peerRef = useRef(null);

  const joinStream = useCallback(() => {
    if (!socket) return;
    socket.emit("join-stream", { streamId, role: "viewer" });
  }, [socket, streamId]);

  const leaveStream = useCallback(() => {
    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [videoRef]);

  useEffect(() => {
    if (!socket) return;

    const handleOffer = async ({ offer, broadcasterId }) => {
      const peer = new RTCPeerConnection(ICE_SERVERS);
      peerRef.current = peer;

      peer.ontrack = (event) => {
        if (videoRef.current) {
          videoRef.current.srcObject = event.streams[0];
        }
      };

      peer.onicecandidate = (event) => {
        if (event.candidate) {
          socket.emit("ice-candidate", {
            candidate: event.candidate,
            targetId: broadcasterId,
          });
        }
      };

      await peer.setRemoteDescription(new RTCSessionDescription(offer));

      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      socket.emit("webrtc-answer", { answer, broadcasterId });
    };

    const handleIceCandidate = ({ candidate }) => {
      if (peerRef.current && candidate) {
        peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    };

    const handleBroadcasterLeft = () => {
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };

    socket.on("webrtc-offer", handleOffer);
    socket.on("ice-candidate", handleIceCandidate);
    socket.on("broadcaster-left", handleBroadcasterLeft);

    return () => {
      socket.off("webrtc-offer", handleOffer);
      socket.off("ice-candidate", handleIceCandidate);
      socket.off("broadcaster-left", handleBroadcasterLeft);
    };
  }, [socket, videoRef]);

  return { joinStream, leaveStream };
};

export default useViewer;
