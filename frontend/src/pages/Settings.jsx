import { useState, useEffect, useRef } from "react";
import { User, Bell, Shield, LogOut, Video, Key, Copy, RefreshCw, Check } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { authAPI, streamsAPI } from "../utils/api";

const AccountSettings = ({ editUsername, editEmail, editPassword, setEditUsername, setEditEmail, setEditPassword, handleSaveAccount, savingAccount }) => (
  <div className="space-y-6">
    {/* Basic Information */}
    <div>
      <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
        <User size={20} />
        Account Information
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
          <input
            type="text"
            value={editUsername}
            onChange={(e) => setEditUsername(e.target.value)}
            placeholder="Enter your username"
            maxLength={30}
            className="glass-input px-4 py-3 text-white w-full"
          />
          <p className="text-gray-500 text-xs mt-1">3-30 characters, letters, numbers, and underscores only</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
          <input
            type="email"
            value={editEmail}
            onChange={(e) => setEditEmail(e.target.value)}
            placeholder="Enter your email"
            className="glass-input px-4 py-3 text-white w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
          <input
            type="password"
            value={editPassword}
            onChange={(e) => setEditPassword(e.target.value)}
            placeholder="Enter new password (leave blank to keep current)"
            minLength={6}
            className="glass-input px-4 py-3 text-white w-full"
          />
          <p className="text-gray-500 text-xs mt-1">Minimum 6 characters. Leave blank to keep current password.</p>
        </div>
      </div>
    </div>

    {/* Save Button */}
    <div className="flex justify-end pt-4">
      <button
        onClick={handleSaveAccount}
        className="btn-primary px-6 py-2 text-sm"
        disabled={savingAccount}
      >
        {savingAccount ? "Saving..." : "Save Changes"}
      </button>
    </div>
  </div>
);

const StreamSettings = ({ editTitle, editCategory, editThumbnailUrl, editCoverPageUrl, setEditTitle, setEditCategory, setEditThumbnailUrl, setEditCoverPageUrl, handleSaveStream, saving, copiedKey, stream, copyKey, handleRegenerateKey }) => (
  <div className="space-y-3">
    {/* Stream Configuration */}
    <div>
      <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
        <Video size={16} />
        Stream Configuration
      </h3>
      <div className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Stream Title</label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="What are you streaming today?"
              maxLength={100}
              className="glass-input py-2 text-sm w-full"
            />
            <p className="text-gray-500 text-xs mt-1">{editTitle.length}/100 characters</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-300 mb-1">Category</label>
            <select
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              className="glass-input py-2 text-sm w-full"
            >
              {["gaming", "music", "tech", "sports", "creative", "education", "chat", "other"].map((c) => (
                <option key={c} value={c} style={{ background: "#080808" }}>
                  {c.charAt(0).toUpperCase() + c.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-300 mb-1">Cover Page URL</label>
          <input
            type="url"
            value={editCoverPageUrl}
            onChange={(e) => setEditCoverPageUrl(e.target.value)}
            placeholder="https://example.com/cover-image.jpg"
            className="glass-input py-2 text-sm w-full"
          />
          <p className="text-gray-500 text-xs mt-1">Enter a URL for your stream cover page image</p>
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

const Settings = () => {
  const { user, logout } = useAuth();
  const { success: showSuccess, error: showError } = useToast();
  const [activeTab, setActiveTab] = useState("account");
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedKey, setCopiedKey] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editThumbnailUrl, setEditThumbnailUrl] = useState("");
  const [editCoverPageUrl, setEditCoverPageUrl] = useState("");
  const [editUsername, setEditUsername] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [savingAccount, setSavingAccount] = useState(false);

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
          setEditCoverPageUrl(data.stream.coverPageUrl || "");
        } catch (err) {
          console.error("Failed to fetch stream:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchStream();
  }, [activeTab]);

  useEffect(() => {
    // Set user data only when switching to account tab and fields are empty
    if (activeTab === "account" && user && editUsername === "" && editEmail === "") {
      setEditUsername(user.username || "");
      setEditEmail(user.email || "");
    }
  }, [activeTab, user]);


  const copyKey = () => {
    navigator.clipboard.writeText(stream.streamKey);
    setCopiedKey(true);
    showSuccess("Stream key copied to clipboard!");
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRegenerateKey = async () => {
    if (!confirm("This will invalidate your current stream key. Continue?")) return;
    try {
      const data = await streamsAPI.regenerateKey();
      setStream({ ...stream, streamKey: data.streamKey });
      showSuccess("Stream key regenerated successfully!");
    } catch (err) {
      showError(err.message || "Failed to regenerate stream key");
    }
  };

  const handleSaveStream = async () => {
    setSaving(true);
    try {
      const data = await streamsAPI.updateMyStream({ title: editTitle, category: editCategory, thumbnailUrl: editThumbnailUrl, coverPageUrl: editCoverPageUrl });
      setStream(data.stream);
      showSuccess("Stream settings saved successfully!");
    } catch (err) {
      showError(err.message || "Failed to save stream settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAccount = async () => {
    setSavingAccount(true);
    try {
      const updateData = { username: editUsername, email: editEmail };
      if (editPassword) {
        updateData.password = editPassword;
      }

      const data = await authAPI.updateMe(updateData);

      showSuccess("Account settings saved successfully!");
      setEditPassword(""); // Clear password field after successful update
    } catch (err) {
      showError(err.message || "Failed to save account settings");
    } finally {
      setSavingAccount(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "account":
        return (
          <AccountSettings
            editUsername={editUsername}
            editEmail={editEmail}
            editPassword={editPassword}
            setEditUsername={setEditUsername}
            setEditEmail={setEditEmail}
            setEditPassword={setEditPassword}
            handleSaveAccount={handleSaveAccount}
            savingAccount={savingAccount}
          />
        );
      case "stream":
        return (
          <StreamSettings
            editTitle={editTitle}
            editCategory={editCategory}
            editThumbnailUrl={editThumbnailUrl}
            editCoverPageUrl={editCoverPageUrl}
            setEditTitle={setEditTitle}
            setEditCategory={setEditCategory}
            setEditThumbnailUrl={setEditThumbnailUrl}
            setEditCoverPageUrl={setEditCoverPageUrl}
            handleSaveStream={handleSaveStream}
            saving={saving}
            copiedKey={copiedKey}
            stream={stream}
            copyKey={copyKey}
            handleRegenerateKey={handleRegenerateKey}
          />
        );
      default:
        return (
          <AccountSettings
            editUsername={editUsername}
            editEmail={editEmail}
            editPassword={editPassword}
            setEditUsername={setEditUsername}
            setEditEmail={setEditEmail}
            setEditPassword={setEditPassword}
            handleSaveAccount={handleSaveAccount}
            savingAccount={savingAccount}
          />
        );
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
