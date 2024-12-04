import { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import { FaPaperPlane, FaSmile } from "react-icons/fa";
import Picker from "emoji-picker-react";

const socket = io("/");

export default function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef(null);

  // Recibir mensajes del servidor
  useEffect(() => {
    socket.on("message", receiveMessage);

    return () => {
      socket.off("message", receiveMessage);
    };
  }, []);

  const receiveMessage = (message) =>
    setMessages((state) => [...state, message]);

  // Enviar mensajes al servidor
  const handleSubmit = (event) => {
    event.preventDefault();
    const newMessage = {
      body: message,
      from: "Me",
    };
    setMessages((state) => [...state, newMessage]);
    setMessage("");
    socket.emit("message", newMessage.body);
  };

  // Añadir emoji al mensaje
  const onEmojiClick = (emojiData) => {
    setMessage((prevMessage) => prevMessage + emojiData.emoji);
  };

  // Desplazar automáticamente al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-screen bg-gradient-to-r from-indigo-500 to-pink-500 text-white flex flex-col justify-between items-center p-4">
      <h1 className="text-4xl font-bold mb-4 text-center text-white">
        Chat Formal
      </h1>
      <ul className="flex-grow w-full max-w-lg overflow-y-auto bg-white rounded-lg shadow-lg p-4 mb-4 flex flex-col">
        {messages.map((message, index) => (
          <li
            key={index}
            className={`mb-4 ${
              message.from === "Me" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block p-3 rounded-lg ${
                message.from === "Me"
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-800"
              }`}
            >
              <span>
                {message.from === "Me" ? (
                  <b className="text-gray-800">Yo</b>
                ) : (
                  <b className="text-gray-800">Amigos</b>
                )}
                : {message.body}
              </span>
            </div>
          </li>
        ))}
        <div ref={messagesEndRef} />
      </ul>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white p-4 rounded-lg shadow-lg flex items-center"
      >
        <input
          name="message"
          type="text"
          placeholder="Escribe tu mensaje..."
          onChange={(e) => setMessage(e.target.value)}
          className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
          value={message}
          autoFocus
        />
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="flex-shrink-0 bg-yellow-500 hover:bg-yellow-700 border-yellow-500 hover:border-yellow-700 text-sm border-4 text-white py-1 px-2 rounded"
        >
          <FaSmile />
        </button>
        <button
          type="submit"
          className="flex-shrink-0 bg-blue-500 hover:bg-blue-700 border-blue-500 hover:border-blue-700 text-sm border-4 text-white py-1 px-2 rounded"
        >
          <FaPaperPlane />
        </button>
      </form>
      {showEmojiPicker && <Picker onEmojiClick={onEmojiClick} />}
    </div>
  );
}
