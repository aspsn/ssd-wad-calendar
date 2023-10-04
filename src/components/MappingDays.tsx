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
    const dataNotes: Array<currentDayInterface> | [] = dataLocal
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
        currentMonth: firstDayOfMonth.getMonth() === day.getMonth(),
        date: new Date(firstDayOfMonth),
        month: firstDayOfMonth.getMonth(),
        number: firstDayOfMonth.getDate(),
        selected: firstDayOfMonth.toDateString() === day.toDateString(),
        year: firstDayOfMonth.getFullYear(),
        notes:
          dataNotes.length && dataNotes[i].notes.length
            ? dataNotes[i].notes
            : [],
      };

      tempCurrentDays.push(calendarDay);
    }

    setCurrentDays(tempCurrentDays);
  };

  const addEvent = ({ day }: { day: currentDayInterface }) => {
    setIsModal(true);
    setDataOnEdit({
      ...(dataOnEdit as dataOnEditInterface),
      day,
      note: { id: 0, name: "", email: "", color: "", time: "" },
    });
    setTypeModal("add");
  };
  const editEvent = ({
    day,
    note,
  }: {
    day: currentDayInterface;
    note: notesInterface;
  }) => {
    setIsModal(true);
    setDataOnEdit({ ...(dataOnEdit as dataOnEditInterface), day, note });
    setTypeModal("edit");
  };
  const deleteEvent = ({
    day,
    note,
  }: {
    day: currentDayInterface;
    note: notesInterface;
  }) => {
    setIsModal(true);
    setDataOnEdit({ ...(dataOnEdit as dataOnEditInterface), day, note });
    setTypeModal("delete");
  };

  const handleAddEvent = ({
    day,
    note,
  }: {
    day: currentDayInterface;
    note: notesInterface;
  }) => {
    const [h, m] = note.time.split(":");
    const hour: number = parseInt(h);

    const payload: notesInterface = {
      id: new Date().getSeconds(),
      name: note.name,
      email: note.email,
      color: randomColor(),
      time: `${
        hour % 12
          ? `${(hour % 12).toString().length === 1 ? 0 : ""}${hour % 12}`
          : 12
      } : ${m}  ${hour >= 12 ? "PM" : "AM"}`,
    };

    const indexDate: number = currentDays.findIndex((x) => x === day);
    const addNote: Array<currentDayInterface> = currentDays.map(
      (date, index) => ({
        ...date,
        notes: index === indexDate ? [...date.notes, payload] : date.notes,
      }),
    );

    setLocalStorage("data_notes", JSON.stringify(addNote));
    mappingData();
    setIsModal(false);
  };

  const handleEditEvent = ({
    day,
    note,
  }: {
    day: currentDayInterface;
    note: notesInterface;
  }) => {
    const [h, m] = note.time.split(":");
    const hour: number = parseInt(h);

    const payload: notesInterface = {
      id: new Date().getSeconds(),
      name: note.name,
      email: note.email,
      color: randomColor(),
      time: `${
        hour % 12
          ? `${(hour % 12).toString().length === 1 ? 0 : ""}${hour % 12}`
          : 12
      } : ${m}  ${hour >= 12 ? "PM" : "AM"}`,
    };

    const indexDate: number = currentDays.findIndex((x) => x === day);
    const editNote: Array<currentDayInterface> = currentDays.map(
      (date, index) => ({
        ...date,
        notes:
          index === indexDate
            ? [...date.notes.filter((n) => n.id !== note.id && note), payload]
            : date.notes,
      }),
    );

    setLocalStorage("data_notes", JSON.stringify(editNote));
    mappingData();
    setIsModal(false);
  };

  const handleDeleteEvent = ({
    day,
    note,
  }: {
    day: currentDayInterface;
    note: notesInterface;
  }) => {
    const indexDate: number = currentDays.findIndex((x) => x === day);
    const removeNote: Array<currentDayInterface> = currentDays.map(
      (date, index) => ({
        ...date,
        notes:
          index === indexDate
            ? date.notes.filter((n) => n.id !== note.id && note)
            : date.notes,
      }),
    );

    setLocalStorage("data_notes", JSON.stringify(removeNote));
    mappingData();
    setIsModal(false);
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
      if (typeModal === "add") {
        handleAddEvent({ day: dataOnEdit.day, note: dataOnEdit.note });
      } else if (typeModal === "edit") {
        handleEditEvent({ day: dataOnEdit.day, note: dataOnEdit.note });
      } else if (typeModal === "delete") {
        handleDeleteEvent({ day: dataOnEdit.day, note: dataOnEdit.note });
      }
    }
  };

  return (
    <div className="box-border flex w-full flex-wrap justify-center">
      {currentDays.map((day, index) =>
        day.currentMonth ? (
          <div
            key={index}
            className={`relative z-0 min-h-[80px] w-[calc(100%/7)] border border-neutral-400 p-1 hover:bg-neutral-300 
            ${day.currentMonth ? "current" : ""}
            ${day.selected ? "selected" : ""}`}
            onClick={() => (day.notes.length ? null : addEvent({ day: day }))}
          >
            <p className="_date text-neutral-400">{day.number}</p>
            <div className="relative z-50 mt-2 flex flex-col gap-1">
              {day.notes.map((n) => (
                <div className="_note relative z-20" key={n.id}>
                  <div
                    className="p-1 text-sm text-white"
                    style={{ backgroundColor: `#${n.color}` }}
                  >
                    <p>{n.name}</p>
                    <p>{n.email}</p>
                    <p>{n.time}</p>
                  </div>

                  <div className="_btn-action invisible absolute right-0 top-0 flex items-center gap-2 bg-neutral-400 p-1 text-sm text-white">
                    <i
                      className="fa fa-trash cursor-pointer"
                      onClick={() => deleteEvent({ day: day, note: n })}
                    />
                    <i
                      className="fa fa-pencil cursor-pointer"
                      onClick={() => editEvent({ day: day, note: n })}
                    />
                  </div>
                </div>
              ))}
              {day.notes.length && day.notes.length < 3 ? (
                <div onClick={() => addEvent({ day: day })}>Add</div>
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
            <button onClick={() => setIsModal(false)}>Cancel</button>
            <button type="submit">
              {typeModal === "delete" ? "Delete" : "Save"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default MappingDays;
