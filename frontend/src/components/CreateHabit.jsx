import React, { useState } from "react";
import { apiFetch } from "../services/api";

const CreateHabit = ({ roomId, refresh }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Habit name cannot be empty");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await apiFetch("/habit", {
        method: "POST",
        body: JSON.stringify({ name, roomId }),
      });

      setName("");
      if (refresh) refresh();
    } catch (err) {
      setError(err.message || "Failed to create habit");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-card" style={{ marginBottom: "1.5rem" }}>
      <h3 className="card-title" style={{ fontSize: "1.1rem", margin: "0 0 0.5rem 0" }}>
        Add a New Habit
      </h3>
      <form onSubmit={handleCreate} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
        <input
          type="text"
          className="form-input"
          style={{ flex: 1, minWidth: "200px" }}
          placeholder="e.g., Drink water"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="btn" disabled={loading}>
          {loading ? "Adding..." : "Add Habit"}
        </button>
      </form>
      {error && <p style={{ color: "var(--error)", margin: "0.5rem 0 0 0", fontSize: "0.85rem" }}>{error}</p>}
    </div>
  );
};

export default CreateHabit;
