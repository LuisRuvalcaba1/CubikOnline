import Amigos from "../models/amigos.model.js";
import User from "../models/user.model.js";

export const addFriend = async (req, res) => {
  try {
    const { user1, user2 } = req.body;
    const userFound1 = await User.findById(user1);
    const userFound2 = await User.findById(user2);

    if (!userFound1 || !userFound2) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }
    const newFriend = new Amigos({ user1, user2 });
    const savedFriend = await newFriend.save();

    res.json(savedFriend);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getYourFriends = async (req, res) => {
  try {
    const friends = await Amigos.find({
      $or: [
        { user1: req.user.id, status: true },
        { user2: req.user.id, status: true }
      ]
    })
    .populate("user1", "username")
    .populate("user2", "username");

    const friendsList = friends.map(friend => {
      if (friend.user1._id.toString() === req.user.id) {
        return { username: friend.user2.username, _id: friend.user2._id };
      } else {
        return { username: friend.user1.username, _id: friend.user1._id };
      }
    });

    res.json(friendsList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFriends = async (req, res) => {
  try {
    const friends = await Amigos.find({
      user2: req.user.id,
      status: false,
    }).populate("user1");
    res.json(friends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const acceptFriend = async (req, res) => {
  try {
    const friend = await Amigos.findByIdAndUpdate(
      req.params.id,
      { status: true },
      { new: true }
    );

    if (!friend) {
      return res
        .status(404)
        .json({ message: "Solicitud de amistad no encontrada" });
    }

    res.json(friend);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const denyFriend = async (req, res) => {
  try {
    await Amigos.findByIdAndDelete(req.params.id);
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
