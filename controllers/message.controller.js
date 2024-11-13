const Message = require('../models/message.models.js');
const User = require('../models/user.models.js');

// Send message
exports.sendMessage = async (req, res) => {
  const { email, content } = req.body;

  try {
    const receiver = await User.findOne({ email });

    if (!receiver) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    const message = new Message({
      sender: req.user.id,   // Sender is the logged-in user
      receiver: receiver._id,
      content,
    });

    await message.save();

    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};




// Get messages between two users
exports.getMessages = async (req, res) => {
  const { email } = req.body;

  try {
    const receiver = await User.findOne({ email });

    if (!receiver) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    // Find messages between the logged-in user and the recipient
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: receiver._id },
        { sender: receiver._id, receiver: req.user.id },
      ],
    }).sort({ timestamp: -1 });  // Sort messages by timestamp (newest first)

    res.status(200).json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
