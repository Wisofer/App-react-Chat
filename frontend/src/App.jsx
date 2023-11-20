import React, { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("/");

const App = () => {
  const [mensaje, setMensaje] = useState('');
  const [newMensaje, setNewmensaje] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newwMensaje = {
      body: mensaje,
      from: "yo",
    };
    setNewmensaje([...newMensaje, newwMensaje]);
    socket.emit("mensaje", mensaje);
    setMensaje(""); // Restablecer el valor del input a una cadena vacía
  };

  useEffect(() => {
    socket.on("mensaje", resivirMensaje);

    return () => {
      socket.off("mensaje", resivirMensaje);
    };
  }, []);

  const resivirMensaje = (mensaje) =>
    setNewmensaje((state) => [...state, mensaje]);

  return (
    <div className="h-screen bg-zinc-800 text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="bg-zinc-900 p-10">
        <h1 className="text-2xl font-bold my-2">Chat wiso</h1>
        <div className="flex">
          <input
            onChange={(e) => setMensaje(e.target.value)}
            type="text"
            placeholder="Envie un mensaje"
            className="border-2 border-zinc-500 p-2 w-full text-black mr-2 "
          />
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
            Enviar
          </button>
        </div>
        <ul>
          {newMensaje.map((item, i) => (
            <li
              key={i}
              className={`my-2 p-2 table text-sm rounded-md ${
                item.from === "yo" ? "bg-blue-500 text-white " : "bg-gray-500 text-black ml-auto "
              }`}
            >
              {item.from} : {item.body}
            </li>
          ))}
        </ul>
      </form>
    </div>
  );
};

export default App;