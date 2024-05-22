import Amigos from "../models/amigos.model.js";

export const addFriend = async (req, res) => {
  const { user1, user2 } = req.body;
  try {
    const userFriends = await Amigos.findOne({ user1, user2 });
    if (userFriends)
      return res.status(400).json({ message: "Friendship already exists" });
    const newFriendship = new Amigos({ user1, user2 });
    await newFriendship.save();
    res.json(newFriendship);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFriends = async (req, res) => {
  const { id } = req.params;
  try {
    const userFriends = await Amigos.find({ user1: id }).populate("user2");
    res.json(userFriends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const acceptFriend = async (req, res) => {
    const { id } = req.params;
    try {
        const friend = await Amigos.findByIdAndUpdate(id, { status: true }, { new: true });
        res.json(friend);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const denyFriend = async (req, res) => {
    const { id } = req.params;
    try {
        const friend = await Amigos.findByIdAndDelete(id);
        res.json(friend);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}
