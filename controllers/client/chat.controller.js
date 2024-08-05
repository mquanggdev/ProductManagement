const Chat = require("../../model/chat.model");
const User = require("../../model/users.model");

// [GET] /chat/
module.exports.index = async (req, res) => {
  const userId = res.locals.user.id ;
    // SocketIO
    _io.once("connection", (socket) => {
        // CLIENT_SEND_MESSAGE
      socket.on("CLIENT_SEND_MESSAGE" , async (data) => {
        const chatMessage = {
          userId : userId,
          content : data.content
        }
        const newMessage = new Chat(chatMessage);
        await newMessage.save() ;
      })
    });
    // End SocketI

    const chats = await Chat.find({});

    for (const chat of chats) {
      const infoUser = await User.findOne({
        _id: chat.userId
      });
      chat.fullname = infoUser.fullname;
    }
    res.render("client/pages/chat/index", {
      pageTitle: "Chat",
      chats:chats
    });
  };