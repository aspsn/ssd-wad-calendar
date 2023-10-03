interface currentDayInterface {
  currentMonth: boolean;
  date: Date;
  month: number;
  number: number;
  selected: boolean;
  year: number;
  notes: Array<notesInterface> | [];
}

interface notesInterface {
  id: number;
  name: string;
  email: string;
  time: string;
  color: string;
}

export type { currentDayInterface, notesInterface };
