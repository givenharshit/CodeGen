import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/user.context";
import { useLocation } from "react-router-dom";
import axios from "../config/axios.js";
import {
  initializeSocket,
  receiveMessage,
  sendMessage,
} from "../config/socket";
import Markdown from "markdown-to-jsx";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export const LeftSection = () => {
  const location = useLocation();
  const { user } = useContext(UserContext);
  const [isSlidePanelOpen, setIsSlidePanelOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState([]);
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]); // State to store all messages
  const [project, setProject] = useState(location.state.project);
  const messageRef = React.useRef(null);

  const handleUserClick = (id) => {
    setSelectedUserId((prevSelectedUserId) => {
      const newSelectedUserId = new Set(prevSelectedUserId);
      if (newSelectedUserId.has(id)) {
        newSelectedUserId.delete(id);
      } else {
        newSelectedUserId.add(id);
      }
      return Array.from(newSelectedUserId);
    });
  };

  // New Code
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    alert("Code copied to clipboard!");
  };

  // New Code
  const renderMessageContent = (msg) => {
    if (msg.sender._id === "ai" && msg.message.includes("```")) {
      // Extract code block from Markdown
      const codeBlock = msg.message.match(/```([\s\S]*?)```/)?.[1] || "";
      return (
        <div className="relative">
          <SyntaxHighlighter
            language="javascript"
            style={vscDarkPlus}
            className="rounded-lg overflow-hidden"
          >
            {codeBlock}
          </SyntaxHighlighter>
          {msg.message === "" ? null : (
            <button
              onClick={() => handleCopy(codeBlock)}
              className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded text-sm hover:bg-blue-600"
            >
              Copy
            </button>
          )}
        </div>
      );

    } else if (msg.sender._id === "ai") {
      // Render Markdown for non-code AI responses
      return <Markdown>{msg.message}</Markdown>;
    } else {
      // Render plain text for user messages
      return msg.message;
    }
  };

  function addProjectCollaborators() {
    axios
      .put("/api/projects/add-user", {
        projectId: location.state.project._id,
        user: Array.from(selectedUserId),
      })
      .then((res) => {
        setIsModalOpen(false);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  function send() {
    if (message.trim() === "") return;

    const outgoingMessage = {
      message,
      sender: { _id: user.user._id, email: user.user.email },
    };

    // Send the message to the server
    sendMessage("project-message", outgoingMessage);

    // Append the outgoing message to the state
    setMessages((prevMessages) => [...prevMessages, outgoingMessage]);

    setMessage("");
  }

  useEffect(() => {
    axios
      .get(`api/projects/get-project/${location.state.project._id}`)
      .then((res) => {
        setProject(res.data.projectInfo);
      })
      .catch((err) => {
        console.error(err);
      });

    axios
      .get("/api/users/all")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.error(err);
      });

    initializeSocket(project._id);

    const messageListener = (data) => {
      // Append the incoming message to the state
      setMessages((prevMessages) => [...prevMessages, data]);
    };

    receiveMessage("project-message", messageListener);

    return () => {
      receiveMessage("project-message", null);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]); // Scroll to bottom whenever messages change

  function scrollToBottom() {
    if (messageRef.current) {
      messageRef.current.scrollTop = messageRef.current.scrollHeight;
    }
  }

  return (
    
      <div className="w-full max-w-7xl bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row gap-6">
        {/* Left Section */}
        <div className="w-full flex flex-col gap-6">
          {/* Chat Section */}
          <div className="bg-gray-50 p-4 rounded-lg shadow-md flex-grow">
            {/* Header */}
            <header className="flex justify-between px-4 w-full bg-white text-white rounded-t-lg border-b-2 border-gray-200 p-2">
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 bg-white text-blue-500 px-4 py-2 rounded-lg hover:bg-gray-100"
              >
                <i className="ri-user-add-line m-1 text-xl"></i>
                <p>Add Collaborators</p>
              </button>
              <button
                onClick={() => setIsSlidePanelOpen(!isSlidePanelOpen)}
                className="p-2 bg-white text-blue-500 rounded-lg hover:bg-gray-100"
              >
                <i className="ri-group-line text-xl"></i>
              </button>
            </header>

            {/* Message Panel */}
            <div
              ref={messageRef}
              className="message-box h-96 w-full overflow-y-scroll overflow-x-hidden bg-white p-4 rounded-b-lg border border-gray-200"
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`message mb-4 flex flex-col max-w-full w-fit break-words transparent relative
                     ${msg.sender._id === user.user._id ? "ml-auto" : ""}`}
                >
                  <small
                    className={`text-xs text-gray-500 pl-2 ${
                      msg.sender._id === user.user._id ? "ml-auto" : ""
                    }`}
                  >
                    {msg.sender.email}
                  </small>

                  <div
                    className={`p-2 rounded-lg max-w-3/4 w-fit break-words mt-0.5 ${
                      msg.sender._id === user.user._id
                        ? "bg-green-100 ml-auto"
                        : "bg-gray-100"
                    }`}
                  >
                    {renderMessageContent(msg)}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Section */}
            <div className="mt-4 flex">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                type="text"
                placeholder="Enter message"
                className="flex-grow p-2 border border-gray-300 rounded-l-lg focus:outline-none"
              />
              <button
                onClick={send}
                className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Right Section */}

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
              <h2 className="text-xl font-semibold mb-4">Select a User</h2>
              <div className="users-list flex flex-col gap-2 max-h-96 overflow-auto">
                {users.map((user) => (
                  <div
                    key={user._id}
                    onClick={() => handleUserClick(user._id)}
                    className={`p-2 flex items-center justify-between bg-gray-100 ${
                      selectedUserId.includes(user._id) ? "bg-gray-300" : ""
                    } rounded-lg cursor-pointer`}
                  >
                    <span>{user.email}</span>
                    <i className="ri-user-line text-xl"></i>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
                >
                  Close
                </button>
                <button
                  onClick={addProjectCollaborators}
                  className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                >
                  Add Collaborators
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
  );
};

export default LeftSection;
