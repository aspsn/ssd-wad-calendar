import { getLocalStorage, setLocalStorage } from "@/helpers/localStorage";
import { currentDayInterface, notesInterface } from "@/interface/calendar";
import { useEffect, useState } from "react";

function MappingDays({ day }: { day: Date }) {
  const countColumn: number = 35;
  const [currentDays, setCurrentDays] = useState<Array<currentDayInterface>>(
    [],
  );

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

  const handleAddEvent = (day: currentDayInterface) => {
    const payload: notesInterface = {
      id: new Date().getSeconds(),
      name: `${Math.random()}-event`,
      email: `event0${new Date().getSeconds()}@gmail.com`,
      color: randomColor(),
      time: new Date().getTime().toString(),
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
  };

  const handleEditEvent = (day: currentDayInterface) => {
    console.log(day);
  };

  const handleDeleteEvent = ({
    day,
    idNote,
  }: {
    day: currentDayInterface;
    idNote: number;
  }) => {
    console.log(day);
    console.log(idNote);

    const indexDate: number = currentDays.findIndex((x) => x === day);
    const removeNote: Array<currentDayInterface> = currentDays.map(
      (date, index) => ({
        ...date,
        notes:
          index === indexDate
            ? date.notes.filter((note) => note.id !== idNote && note)
            : date.notes,
      }),
    );

    setLocalStorage("data_notes", JSON.stringify(removeNote));
    mappingData();
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
            onClick={() => (day.notes.length ? null : handleAddEvent(day))}
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
                      onClick={() => handleDeleteEvent({ day, idNote: n.id })}
                    />
                    <i
                      className="fa fa-pencil cursor-pointer"
                      onClick={() => {}}
                    />
                  </div>
                </div>
              ))}
              {day.notes.length && day.notes.length < 3 ? (
                <div onClick={() => handleAddEvent(day)}>Add</div>
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
    </div>
  );
}

export default MappingDays;
