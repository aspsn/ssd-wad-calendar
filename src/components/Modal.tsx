import React, { useEffect } from "react";

interface ModalInterface {
  isShow: boolean;
  titleModal: string;
  titlePosition?: "center" | "left";
  size: "sm" | "md" | "lg";
  children?: React.ReactNode;
  toggle: () => void;
}

function Modal({
  isShow,
  titleModal,
  titlePosition,
  size,
  children,
  toggle,
}: ModalInterface) {
  useEffect(() => {
    if (!isShow) {
      handleCloseModal();
    } else {
      handleOpenModal();
    }
  }, [isShow]);

  const handleOpenModal = () => {
    let body: HTMLElement | null = document.body;
    if (body) body.style.overflow = "hidden";
  };

  const handleCloseModal = () => {
    let body: HTMLElement | null = document.body;
    if (body) body.style.overflow = "auto";
  };

  return (
    <div className={`modal-custom ${isShow ? "show" : ""} `}>
      <div className="container-wrapper mt-[20%] flex h-full justify-center">
        <div
          className={`modal-custom-body ${
            size === "sm"
              ? "small"
              : size === "md"
              ? "medium"
              : size === "lg"
              ? "large"
              : ""
          }`}
        >
          <div className="flex w-full justify-between">
            <h2
              className={
                titlePosition === "center"
                  ? "text-center"
                  : titlePosition === "left"
                  ? "text-left"
                  : "text-center"
              }
            >
              {titleModal}
            </h2>
            <button
              className="btn-close"
              onClick={() => {
                toggle();
                handleCloseModal();
              }}
            >
              {/* <img
                src="/images/icon/ic-close.svg"
                alt="icon"
                className="w-full"
              /> */}
              <i className="fa fa-close text-sm text-black" />
            </button>
          </div>
          {isShow && children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
