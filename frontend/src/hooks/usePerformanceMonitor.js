import { useEffect, useRef, useState, useCallback } from "react";
import { useSocket } from "../context/SocketContext";

const usePerformanceMonitor = (streamId) => {
  const socket = useSocket();
  const [metrics, setMetrics] = useState({
    latency: 0,
    bandwidth: 0,
    packetLoss: 0,
    quality: 'good'
  });
  const pingIntervalRef = useRef(null);
  const statsIntervalRef = useRef(null);
  const peerConnectionRef = useRef(null);

  const measureLatency = useCallback(() => {
    if (!socket) return;
    
    const startTime = Date.now();
    socket.emit("ping");
    
    const handlePong = ({ timestamp }) => {
      const latency = Date.now() - timestamp;
      setMetrics(prev => ({ ...prev, latency }));
    };
    
    socket.once("pong", handlePong);
  }, [socket]);

  const measureConnectionStats = useCallback((peerConnection) => {
    if (!peerConnection) return;

    peerConnection.getStats().then(stats => {
      let bandwidth = 0;
      let packetsLost = 0;
      let packetsReceived = 0;

      stats.forEach(report => {
        if (report.type === 'inbound-rtp' && report.mediaType === 'video') {
          bandwidth = (report.bytesReceived || 0) * 8 / 1024; // kbps
          packetsReceived = report.packetsReceived || 0;
          packetsLost = report.packetsLost || 0;
        }
      });

      const packetLossRate = packetsReceived > 0 ? (packetsLost / (packetsReceived + packetsLost)) * 100 : 0;
      
      // Determine quality based on metrics
      let quality = 'good';
      if (metrics.latency > 500 || packetLossRate > 5 || bandwidth < 500) {
        quality = 'poor';
      } else if (metrics.latency > 200 || packetLossRate > 2 || bandwidth < 1000) {
        quality = 'fair';
      }

      setMetrics(prev => ({
        ...prev,
        bandwidth,
        packetLoss: packetLossRate,
        quality
      }));
    });
  }, [metrics.latency]);

  const startMonitoring = useCallback((peerConnection) => {
    peerConnectionRef.current = peerConnection;
    
    // Start latency monitoring
    pingIntervalRef.current = setInterval(measureLatency, 5000);
    
    // Start connection stats monitoring
    statsIntervalRef.current = setInterval(() => {
      measureConnectionStats(peerConnection);
    }, 2000);
  }, [measureLatency, measureConnectionStats]);

  const stopMonitoring = useCallback(() => {
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
    
    if (statsIntervalRef.current) {
      clearInterval(statsIntervalRef.current);
      statsIntervalRef.current = null;
    }
    
    peerConnectionRef.current = null;
  }, []);

  const adaptQuality = useCallback((peerConnection) => {
    if (!peerConnection) return;

    const { quality, bandwidth } = metrics;
    
    // Adaptive bitrate based on connection quality
    let videoConstraints = {
      width: { ideal: 1280, max: 1920 },
      height: { ideal: 720, max: 1080 },
      frameRate: { ideal: 30, max: 60 }
    };

    if (quality === 'poor') {
      videoConstraints = {
        width: { ideal: 640, max: 854 },
        height: { ideal: 360, max: 480 },
        frameRate: { ideal: 15, max: 30 }
      };
    } else if (quality === 'fair') {
      videoConstraints = {
        width: { ideal: 854, max: 1280 },
        height: { ideal: 480, max: 720 },
        frameRate: { ideal: 24, max: 30 }
      };
    }

    // Apply constraints to video tracks
    peerConnection.getSenders().forEach(sender => {
      if (sender.track && sender.track.kind === 'video') {
        sender.track.applyConstraints(videoConstraints).catch(err => {
          console.log('Failed to apply adaptive constraints:', err);
        });
      }
    });
  }, [metrics]);

  useEffect(() => {
    return () => {
      stopMonitoring();
    };
  }, [stopMonitoring]);

  return {
    metrics,
    startMonitoring,
    stopMonitoring,
    adaptQuality
  };
};

export default usePerformanceMonitor;
