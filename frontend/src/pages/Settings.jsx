import { useState, useEffect } from "react";
import { User, Bell, Shield, LogOut, Video, Key, Copy, RefreshCw, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { streamsAPI } from "../utils/api";

const Settings = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("account");
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editThumbnailUrl, setEditThumbnailUrl] = useState("");
  const [saving, setSaving] = useState(false);

  const tabs = [
    { id: "account", label: "Account", icon: User },
    { id: "stream", label: "Stream Settings", icon: Video },
  ];

  useEffect(() => {
    const fetchStream = async () => {
      if (activeTab === "stream") {
        try {
          const data = await streamsAPI.getMyStream();
          setStream(data.stream);
          setEditTitle(data.stream.title);
          setEditCategory(data.stream.category);
          setEditThumbnailUrl(data.stream.thumbnailUrl || "");
        } catch (err) {
          console.error("Failed to fetch stream:", err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchStream();
  }, [activeTab]);

  const copyKey = () => {
    navigator.clipboard.writeText(stream.streamKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRegenerateKey = async () => {
    if (!confirm("This will invalidate your current stream key. Continue?")) return;
    try {
      const data = await streamsAPI.regenerateKey();
      setStream({ ...stream, streamKey: data.streamKey });
    } catch (err) {
      console.error("Failed to regenerate key:", err);
    }
  };

  const handleSaveStream = async () => {
    setSaving(true);
    try {
      const data = await streamsAPI.updateMyStream({ title: editTitle, category: editCategory, thumbnailUrl: editThumbnailUrl });
      setStream(data.stream);
    } catch (err) {
      console.error("Failed to save stream settings:", err);
    } finally {
      setSaving(false);
    }
  };

  const StreamSettings = () => (
    <div className="space-y-3">
      {/* Stream Configuration */}
      <div>
        <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
          <Video size={16} />
          Stream Configuration
        </h3>
        <div className="space-y-2">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Stream Title</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="What are you streaming today?"
              maxLength={100}
              className="glass-input py-2 text-sm"
            />
            <p className="text-gray-500 text-xs mt-1">{editTitle.length}/100 characters</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Category</label>
            <select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="glass-input py-2 text-sm"
            >
              {["gaming", "music", "tech", "sports", "creative", "education", "chat", "other"].map((c) => (
                <option key={c} value={c} style={{ background: "#080808" }}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Stream Key Section */}
      <div>
        <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
          <Key size={16} />
          Stream Key
        </h3>
        <div className="glass-card p-2">
          <div className="flex items-center gap-2 mb-1">
            <input
              type="password"
              value={stream?.streamKey || ""}
              readOnly
              className="flex-1 glass-input font-mono text-xs py-1"
            />
            <button
              onClick={copyKey}
              className="btn-ghost px-1 py-1"
              title="Copy key"
            >
              {copiedKey ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
            </button>
            <button
              onClick={handleRegenerateKey}
              className="btn-ghost px-1 py-1 text-red-400 border-red-400/20 hover:bg-red-400/10"
              title="Regenerate key"
            >
              <RefreshCw size={14} />
            </button>
          </div>
          <p className="text-gray-500 text-xs">Keep this key private. Use it with OBS, Streamlabs, or other streaming software.</p>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-1">
        <button
          onClick={handleSaveStream}
          className="btn-primary px-3 py-1 text-sm"
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );

  const AccountSettings = () => (
    <div className="space-y-6">
      {/* Basic Information */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
          <User size={20} />
          Account Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Username</label>
            <div className="glass-input px-4 py-3 text-gray-400">
              {user?.username || 'Not set'}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">Email</label>
            <div className="glass-input px-4 py-3 text-gray-400">
              {user?.email || 'Not set'}
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Settings */}
      <div>
        <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
          <Shield size={20} />
          Privacy Settings
        </h3>
        <div className="space-y-4">
          {[
            { label: "Private profile", description: "Only followers can see your content", defaultChecked: false },
            { label: "Show online status", description: "Let others see when you're online", defaultChecked: true },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between p-4 glass-card">
              <div>
                <p className="text-white font-medium">{item.label}</p>
                <p className="text-gray-500 text-sm mt-1">{item.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={item.defaultChecked} />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );



  const renderTabContent = () => {
    switch (activeTab) {
      case "account":
        return <AccountSettings />;
      case "stream":
        return <StreamSettings />;
      default:
        return <AccountSettings />;
    }
  };

  return (
    <div className="min-h-screen">
      <div className="p-6 lg:p-8 max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-white text-3xl font-semibold">Settings</h1>
          <p className="text-gray-500 text-sm mt-2">Manage your account and streaming preferences</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 p-1 glass-card">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${activeTab === tab.id
                    ? "bg-white text-black shadow-md"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="glass-card p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
