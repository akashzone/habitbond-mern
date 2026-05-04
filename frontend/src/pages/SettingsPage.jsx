import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";

const SettingsPage = () => {
  const { user, updateUserProfile } = useUser();
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setAvatar(user.avatar || "");
    }
  }, [user]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const formData = new FormData();
      formData.append("name", name);
      if (file) {
        formData.append("avatar", file);
      }

      const token = localStorage.getItem("token");
      let apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
      apiUrl = apiUrl.replace(/\/+$/, "");
      if (!apiUrl.endsWith("/api")) {
        apiUrl = `${apiUrl}/api`;
      }
      const res = await fetch(`${apiUrl}/users/me`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.user) {
        updateUserProfile(data.user);
        setSuccess("Profile updated successfully!");
        setFile(null);
        setPreview("");
      } else {
        setError(data.error || "Could not update profile");
      }
    } catch (err) {
      setError(err.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-card w-full max-w-lg mx-auto bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl p-4 sm:p-6 lg:p-8 shadow-[0_10px_40px_rgba(0,0,0,0.6)]">
      <h1 className="text-xl sm:text-2xl font-bold text-white m-0">Account Settings</h1>
      <p className="text-white/60 mt-1 mb-6 text-sm">Update your account information</p>

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-3 rounded-xl text-sm mb-6 text-center">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm mb-6 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div>
          <label className="block text-sm text-white/60 mb-2 font-medium">Name</label>
          <input
            type="text"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white placeholder-white/30 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-2 font-medium">Email Address</label>
          <input
            type="email"
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white/30 cursor-not-allowed"
            value={user?.email || ""}
            readOnly
          />
        </div>

        <div>
          <label className="block text-sm text-white/60 mb-2 font-medium">Profile Image</label>
          <div className="flex flex-col sm:flex-row gap-4 items-center mb-2">
            <div className="w-16 h-16 rounded-full border border-white/10 bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
              {preview || avatar ? (
                <img src={preview || avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white/30 text-xl font-bold uppercase">
                  {user?.name ? user.name[0] : "U"}
                </span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              className="w-full text-sm text-white/50 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600/20 file:text-indigo-400 hover:file:bg-indigo-600/30 file:cursor-pointer"
              onChange={handleFileChange}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 mt-2 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 transition-all shadow-[0_5px_20px_rgba(99,102,241,0.4)] disabled:opacity-50"
        >
          {loading ? "Uploading & Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
};

export default SettingsPage;
