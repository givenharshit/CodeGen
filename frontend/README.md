# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



import React, { useState } from "react";
import { useLocation } from "react-router-dom";

export const Project = () => {
  const [isSlidePanelOpen, setIsSlidePanelOpen] = useState(false);
  const location = useLocation();
  console.log(location.state);
  return (
    <>
      <main className="flex h-screen w-screen">
        <aside className="left flex flex-col h-full min-w-96 bg-gray-300 relative">
          {/* Header */}
          <header className="flex justify-between p-2 px-4 w-full  bg-gray-400">
            <button className="flex items-center gap-2 border-1 border-b-gray-600 rounded-2xl p-2 py-1 cursor-pointer">
              <i class="ri-user-add-line m-1 text-xl"></i>
              <p>Add Collaborators</p>
            </button>
            <button
              onClick={() => setIsSlidePanelOpen(!isSlidePanelOpen)}
              className="p-2 cursor-pointe"
            >
              <i className="ri-group-line text-xl"></i>
            </button>
          </header>

          {/* Chat Area */}
          <div className="conversation-area flex flex-col grow">
            <div className="message-box grow flex flex-col">
              {/* Incoming Message */}
              <div className=" incoming-message flex flex-col m-1 max-w-56 pl-2 pr-2 bg-slate-200 w-fit rounded-md ">
                <small className="opacity-70 text-xs">example@gmail.com</small>
                This is a incoming message.
              </div>

              {/* Outgoing Message */}
              <div className=" incoming-message flex flex-col m-1 ml-auto max-w-56 pl-2 pr-2 bg-slate-200 w-fit rounded-md ">
                <small className="opacity-70 text-xs">example@gmail.com</small>
                This is a outgoing message. It is second line.
              </div>
            </div>
            <div className="inputField w-full flex">
              <input
                className="p-4 px-4 border-none outline-none bg-white grow"
                type="text"
                placeholder="Enter message"
              />
              <button className="cursor-pointer bg-gray-500 p-2 px-4">
                <i className="ri-send-plane-fill text-3xl"></i>
              </button>
            </div>
          </div>

          {/* Slide Panel */}
          <div
            className={`sidePanel flex flex-col gap-2 w-full h-full bg-slate-200 absolute transition-all ${
              isSlidePanelOpen ? "translate-x-0" : "-translate-x-full"
            } top-0`}
          >
            <header className="flex justify-end p-2 px-4 w-full bg-gray-400">
              <button
                onClick={() => setIsSlidePanelOpen(!isSlidePanelOpen)}
                className="p-2 cursor-pointer border-2 border-b-gray-800  rounded-xl"
              >
                <i class="ri-close-line text-xl"></i>
              </button>
            </header>

            <div className="users flex flex-col gap-2">
              <div className="user p-1 flex gap-2 items-center cursor-pointer hover:bg-gray-300">
                <div className="aspect-square p-5 rounded-full w-fit h-fit flex items-center justify-center text-slate-300 bg-gray-500">
                  <i className="ri-user-6-line text-xl absolute"></i>
                </div>

                <h2 className="font-semibold text-lg">username</h2>
              </div>
            </div>
          </div>
        </aside>
py-2 rounded-lg"
      </main>
    </>
  );
};
