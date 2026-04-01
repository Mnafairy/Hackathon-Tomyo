"use client";
import { useState, useEffect } from "react";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [msgs, setMsgs] = useState([{ answer: "Try messaging", id: 0 }]);

  async function sendMessage() {
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });

    const data = await res.json();
    setReply(data.reply);
    setLoading(false);
  }

  useEffect(() => {
    setMsgs([{ answer: reply, id: msgs[0].id + 1 }, ...msgs]);
    console.log(msgs[0].id + 1);
  }, [reply]);

  return (
    <div className="relative">
      <div className="overflow-y-scroll h-96 bg-red-50 flex flex-col-reverse">
        {loading && <p>Loading</p>}
        {msgs.map((msgs) => (
          <p
            key={msgs.id}
            className="m-2 bg-rose-600 text-white bubble p-1"
          >
            {msgs.answer}
          </p>
        ))}
      </div>
      <input
        className="bg-blue-50"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={sendMessage}>Илгээх</button>
    </div>
  );
}
