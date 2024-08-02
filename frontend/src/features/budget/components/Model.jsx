import React from "react";

export default function Model({ children, button }) {
  return (
    <>
      <button
        className=""
        onClick={() => document.getElementById("my_modal_3").showModal()}
      >
        {button}
      </button>
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box">
          <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          {children}
        </div>
      </dialog>
    </>
  );
}
