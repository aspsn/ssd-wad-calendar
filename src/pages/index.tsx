import MappingDays from "@/components/MappingDays";
import { months, weekdays } from "@/constants/calendar";

function Home() {
  const currentDay: Date = new Date();

  return (
    <main className="w-full">
      <div className="flex h-10 w-full items-center justify-center font-semibold">
        <h2>
          {months[currentDay.getMonth()]} {currentDay.getFullYear()}
        </h2>
      </div>
      <div className="w-full border border-neutral-400 bg-neutral-300">
        <div className="flex h-full w-full items-center justify-around">
          {weekdays.map((weekday, index) => (
            <div
              key={index}
              className="w-full bg-indigo-900 py-1 text-center text-white"
            >
              <p>{weekday}</p>
            </div>
          ))}
        </div>

        <MappingDays day={currentDay} />
      </div>
    </main>
  );
}

export default Home;
