import { useEffect, useRef, useCallback } from "react";
import { useSocket } from "../context/SocketContext";
import usePerformanceMonitor from "./usePerformanceMonitor";

const ICE_SERVERS = {
  iceServers: [
    { urls: "stun:stun.l.google.com:19302" },
    { urls: "stun:stun1.l.google.com:19302" },
    { urls: "stun:stun2.l.google.com:19302" },
    {
      urls: "turn:turn.relay.metered.ca:80",
      username: "test",
      credential: "test"
    },
    {
      urls: "turn:turn.relay.metered.ca:443",
      username: "test",
      credential: "test"
    }
  ],
  iceCandidatePoolSize: 10,
};

const useViewer = (streamId, videoRef) => {
  const socket = useSocket();
  const peerRef = useRef(null);
  const { metrics, startMonitoring, stopMonitoring, adaptQuality } = usePerformanceMonitor(streamId);

  const joinStream = useCallback(() => {
    if (!socket) return;
    socket.emit("join-stream", { streamId, role: "viewer" });
  }, [socket, streamId]);

  const leaveStream = useCallback(() => {
    stopMonitoring();
    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [videoRef, stopMonitoring]);

  useEffect(() => {
    if (!socket) return;

    const handleOffer = async ({ offer, broadcasterId }) => {
      const peer = new RTCPeerConnection({
        ...ICE_SERVERS,
        sdpSemantics: 'unified-plan',
        bundlePolicy: 'max-bundle',
        rtcpMuxPolicy: 'require',
        iceTransportPolicy: 'all',
      });
      peerRef.current = peer;

      peer.ontrack = (event) => {
        if (videoRef.current) {
          videoRef.current.srcObject = event.streams[0];

          // Optimize video playback for performance
          const videoTrack = event.streams[0].getVideoTracks()[0];
          if (videoTrack) {
            const settings = videoTrack.getSettings();
            console.log('Video track settings:', settings);

            // Set adaptive constraints based on connection quality
            videoTrack.applyConstraints({
              width: { ideal: 1280, max: 1920 },
              height: { ideal: 720, max: 1080 },
              frameRate: { ideal: 30, max: 60 },
              aspectRatio: { ideal: 16 / 9 }
            }).catch(err => console.log('Constraint application failed:', err));
          }
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

      // Start performance monitoring
      startMonitoring(peer);

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

  return { joinStream, leaveStream, metrics };
};

export default useViewer;
