import Amigos from "../models/amigos.model.js";
import User from "../models/user.model.js";

export const addFriend = async (req, res) => {
  try {
    // Crear una solicitud de amistad
    const { user1, user2 } = req.body;

    // Verificar si los usuarios existen
    const userFound1 = await User.findById(user1);
    const userFound2 = await User.findById(user2);

    if (!userFound1 || !userFound2) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // Crear la solicitud de amistad
    const newFriend = new Amigos({ user1, user2 });
    const savedFriend = await newFriend.save();

    res.json(savedFriend);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFriends = async (req, res) => {
  try {
    const friends = await Amigos.find({ user2: req.user.id, status: false }).populate("user1");
    res.json(friends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export const acceptFriend = async (req, res) => {
  try {
    // Aceptar una solicitud de amistad
    const friend = await Amigos.findByIdAndUpdate(
      req.params.id,
      { status: true },
      { new: true }
    );

    if (!friend) {
      return res.status(404).json({ message: "Solicitud de amistad no encontrada" });
    }

    res.json(friend);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const denyFriend = async (req, res) => {
  try {
    // Rechazar una solicitud de amistad
    const friend = await Amigos.findByIdAndDelete({user2: req.user.id});

    if (!friend) {
      return res.status(404).json({ message: "Solicitud de amistad no encontrada" });
    }

    res.json(friend);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
