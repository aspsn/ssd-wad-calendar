import { getLocalStorage, setLocalStorage } from "@/helpers/localStorage";
import { currentDayInterface, notesInterface } from "@/interface/calendar";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import Input from "./Input";
import Modal from "./Modal";

interface dataOnEditInterface {
  day: currentDayInterface;
  note: notesInterface;
}

function MappingDays({ day }: { day: Date }) {
  const countColumn: number = 35;
  const [currentDays, setCurrentDays] = useState<Array<currentDayInterface>>(
    [],
  );
  const [isModal, setIsModal] = useState<boolean>(false);
  const [typeModal, setTypeModal] = useState<"add" | "edit" | "delete">("add");
  const [dataOnEdit, setDataOnEdit] = useState<dataOnEditInterface>();

  useEffect(() => {
    mappingData();
  }, []);

  const randomColor = (): string => {
    return Math.floor(Math.random() * 16777215).toString(16);
  };

  const mappingData = () => {
    let firstDayOfMonth: Date = new Date(day.getFullYear(), day.getMonth(), 1);
    let weekdayOfFirstDay: number = firstDayOfMonth.getDay();
    let tempCurrentDays: Array<currentDayInterface> = [];
    const dataLocal: string | null = getLocalStorage("data_notes");
    const dataNotes: Array<notesInterface> | [] = dataLocal
      ? JSON.parse(dataLocal)
      : [];

    for (let i = 0; i < countColumn; i++) {
      if (i === 0 && weekdayOfFirstDay === 0) {
        firstDayOfMonth.setDate(firstDayOfMonth.getDate());
      } else if (i === 0) {
        firstDayOfMonth.setDate(
          firstDayOfMonth.getDate() + (i - weekdayOfFirstDay),
        );
      } else {
        firstDayOfMonth.setDate(firstDayOfMonth.getDate() + 1);
      }

      let calendarDay: currentDayInterface = {
        id: parseInt(
          `${firstDayOfMonth.getDate()}${firstDayOfMonth.getMonth()}`,
        ),
        currentMonth: firstDayOfMonth.getMonth() === day.getMonth(),
        date: new Date(firstDayOfMonth),
        month: firstDayOfMonth.getMonth(),
        number: firstDayOfMonth.getDate(),
        selected: firstDayOfMonth.toDateString() === day.toDateString(),
        year: firstDayOfMonth.getFullYear(),
        notes: dataNotes.length
          ? dataNotes.filter(
              (n) =>
                n.id_day ===
                parseInt(
                  `${firstDayOfMonth.getDate()}${firstDayOfMonth.getMonth()}`,
                ),
            )
          : [],
      };

      tempCurrentDays.push(calendarDay);
    }

    setCurrentDays(tempCurrentDays);
  };

  const handleOpenModal = ({
    day,
    note,
    typeModal,
  }: {
    day: currentDayInterface;
    note: notesInterface;
    typeModal: "add" | "edit" | "delete";
  }) => {
    let refacTime = note.time.split(" ");
    refacTime[0] =
      refacTime[4] === "PM" && parseInt(refacTime[0]) < 12
        ? (parseInt(refacTime[0]) + 12).toString()
        : refacTime[4] === "AM" && refacTime[0] === "12"
        ? "00"
        : refacTime[0];

    const timeString = `${refacTime[0]}:${refacTime[2]}`;

    setDataOnEdit({
      ...(dataOnEdit as dataOnEditInterface),
      day,
      note: {
        ...(note as notesInterface),
        time: typeModal === "add" ? "12:00" : timeString,
      },
    });
    setIsModal(true);
    setTypeModal(typeModal);
  };

  const handleChangeInput = (e: ChangeEvent) => {
    const name = (e.target as HTMLInputElement).name;
    const value = (e.target as HTMLInputElement).value;

    setDataOnEdit({
      ...(dataOnEdit as dataOnEditInterface),
      note: { ...(dataOnEdit?.note as notesInterface), [name]: value },
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (dataOnEdit) {
      const [h, m] = dataOnEdit.note.time.split(":");
      const hour: number = parseInt(h);
      const dataLocal: string | null = getLocalStorage("data_notes");
      const dataNotes: Array<notesInterface> | [] = dataLocal
        ? JSON.parse(dataLocal)
        : [];

      const payload: notesInterface = {
        id:
          typeModal === "edit"
            ? dataOnEdit.note.id
            : parseInt(
                `${new Date().getSeconds()}${Math.floor(
                  Math.random() * 16777215,
                )}${dataOnEdit.day.id}`,
              ),
        id_day: dataOnEdit.day.id,
        name: dataOnEdit.note.name,
        email: dataOnEdit.note.email,
        color: typeModal === "edit" ? dataOnEdit.note.color : randomColor(),
        time: `${
          hour % 12
            ? `${(hour % 12).toString().length === 1 ? 0 : ""}${hour % 12}`
            : 12
        } : ${m}  ${hour >= 12 ? "PM" : "AM"}`,
      };

      let data: Array<notesInterface> = [...dataNotes];

      if (typeModal === "add") {
        data.push(payload);
      } else if (typeModal === "edit") {
        data = data.map((n) =>
          n.id === dataOnEdit.note.id
            ? {
                ...n,
                ...payload,
              }
            : n,
        );
      } else if (typeModal === "delete") {
        data = data.filter((n) => n.id !== dataOnEdit.note.id);
      }

      setLocalStorage("data_notes", JSON.stringify(data));
      mappingData();
      setIsModal(false);
    }
  };

  return (
    <div className="box-border flex w-full flex-wrap justify-center">
      {currentDays.map((day, index) =>
        day.currentMonth ? (
          <div
            key={index}
            className={`_day relative z-0 min-h-[80px] w-[calc(100%/7)] border border-neutral-400 p-1 hover:bg-neutral-400 
            ${day.currentMonth ? "current" : ""}
            ${day.selected ? "selected" : ""}`}
            onClick={() =>
              day.notes.length
                ? null
                : handleOpenModal({
                    day,
                    note: {
                      id: 0,
                      id_day: 0,
                      name: "",
                      email: "",
                      color: "",
                      time: "",
                    },
                    typeModal: "add",
                  })
            }
          >
            <p className="_date text-neutral-400">{day.number}</p>
            <div className="relative z-50 mt-2 flex flex-col gap-1">
              {day.notes.map((n) => (
                <div className="_note relative z-20" key={n.id}>
                  <div
                    className="flex flex-col gap-2 overflow-hidden break-words p-1 text-sm text-white"
                    style={{ backgroundColor: `#${n.color}` }}
                  >
                    <p className="font-semibold">{n.name}</p>
                    <p>{n.email}</p>
                    <p>{n.time}</p>
                  </div>

                  <div className="_btn-action invisible absolute right-0 top-0 flex items-center gap-2 bg-neutral-500 p-1 text-sm text-white">
                    <i
                      className="fa fa-trash cursor-pointer"
                      onClick={() =>
                        handleOpenModal({ day, note: n, typeModal: "delete" })
                      }
                    />
                    <i
                      className="fa fa-pencil cursor-pointer"
                      onClick={() =>
                        handleOpenModal({ day, note: n, typeModal: "edit" })
                      }
                    />
                  </div>
                </div>
              ))}
              {day.notes.length && day.notes.length < 3 ? (
                <button
                  className="_btn-add hidden w-full rounded-[6px] border border-neutral-500 bg-white px-3 py-1 text-center text-xs font-semibold text-neutral-700"
                  onClick={() =>
                    handleOpenModal({
                      day,
                      note: {
                        id: 0,
                        id_day: 0,
                        name: "",
                        email: "",
                        color: "",
                        time: "",
                      },
                      typeModal: "add",
                    })
                  }
                >
                  Add
                </button>
              ) : null}
            </div>
          </div>
        ) : (
          <div
            key={index}
            className="min-h-[80px] w-[calc(100%/7)] border border-neutral-400 p-1 hover:bg-neutral-300"
          />
        ),
      )}

      <Modal
        isShow={isModal}
        size="sm"
        titleModal={`${
          typeModal.substring(0, 1).toUpperCase() + typeModal.substring(1)
        } 
        Event`}
        titlePosition="center"
        toggle={() => setIsModal(false)}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {typeModal === "delete" ? (
            <p className="mb-4 py-4 text-center">
              Are you sure want to delete this event?
            </p>
          ) : (
            <>
              <Input
                name="name"
                label="Event"
                required
                paddingH="py-[10px]"
                value={dataOnEdit?.note?.name}
                onChange={handleChangeInput}
              />
              <Input
                name="email"
                label="Email"
                required
                paddingH="py-[10px]"
                value={dataOnEdit?.note?.email}
                onChange={handleChangeInput}
              />
              <Input
                name="time"
                type="time"
                label="Time"
                required
                paddingH="py-[10px]"
                value={dataOnEdit?.note?.time}
                onChange={handleChangeInput}
              />
            </>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className={`flex w-1/2 items-center justify-center rounded-[6px] px-3 py-2 text-xs font-semibold text-white md:text-sm ${
                typeModal === "delete" ? "bg-red-700" : "bg-indigo-900"
              }`}
            >
              {typeModal === "delete" ? "Delete" : "Save"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default MappingDays;
