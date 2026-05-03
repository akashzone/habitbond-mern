const User = require("../models/user");
const cloudinary = require("../config/cloudinary");

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, avatar } = req.body;

    let updateData = {};
    if (name) updateData.name = name;
    if (avatar !== undefined) updateData.avatar = avatar;

    // If file exists -> convert to base64 and upload via cloudinary.uploader.upload
    if (req.file) {
      const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
      try {
        const result = await cloudinary.uploader.upload(fileBase64, {
          folder: "habitbond"
        });
        updateData.avatar = result.secure_url;
      } catch (cloudinaryError) {
        console.warn("Cloudinary Upload Failed, using base64 fallback:", cloudinaryError.message);
        updateData.avatar = fileBase64;
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true }
    ).select("-password");

    res.json({
      message: "Profile updated successfully",
      user: updatedUser
    });
  } catch (err) {
    console.error("Update Profile Error:", err.message);
    res.status(500).json({ error: err.message || "Profile update failed" });
  }
};

const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("Get Profile Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { updateProfile, getProfile };
