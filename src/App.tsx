import { useState } from "react";
import "./App.css";
import lightIcon from "./assets/light.svg";
import shape1 from "./assets/shape-1.svg";
import shape2 from "./assets/Shape-2.svg";
import shape3 from "./assets/shape-3.svg";

function App() {
  const [metrics, setMetrics] = useState<{
    densities: Array<{ letter: string; percentage: number; count: number }>;
    totalChars: number;
    wordCount: number;
    sentenceCount: number;
  }>({
    densities: [],
    sentenceCount: 0,
    totalChars: 0,
    wordCount: 0,
  });
  const [allDensitiesShown, setAllShowing] = useState<boolean>(false);
  const [showCharLimitInput, setShowCharLimitInput] = useState<boolean>(false);
  const [charLimit, setCharLimit] = useState<number | undefined>();
  const [minutesToRead, setMinutesNeeded] = useState<number>(1);

  return (
    <main>
      <section className="flex justify-between">
        <section className="flex gap-2 items-center py-4.5">
          <div className="h-10 w-10 bg-[url(logo-dark.svg)] bg-contain bg-no-repeat"></div>
          <p>Character Counter</p>
        </section>
        <button className="inline-flex justify-center items-center h-11 w-11 bg-neutral-700 rounded-lg hover:cursor-pointer">
          <img className="w-6 h-6" src={lightIcon} />
        </button>
      </section>
      <h1 className="mb-10 text-center">
        Analyze your text in
        <br /> real-time
      </h1>
      <form
        onChange={(e) => {
          const averageWordsReadPerMinute = 238;
          const input = e.target as HTMLInputElement;
          const inputId = input.id;

          const textareaInput: HTMLTextAreaElement | null =
            e.currentTarget.querySelector("#word-input");

          const chExcludeSpaces: HTMLInputElement | null =
            e.currentTarget.querySelector("#ch_exclude_spaces");
          let content = textareaInput?.value || "";

          if (inputId === "ch_limit") {
            setShowCharLimitInput(!showCharLimitInput);
          } else if (inputId === "input_char_limit") {
            const limit = Number.parseInt(input.value);

            if (!Number.isNaN(limit) && textareaInput) {
              setCharLimit(limit);
              content = content.substring(0, limit);
              textareaInput.value = content;
            }
          }

          if (content) {
            content = chExcludeSpaces?.checked
              ? content.replaceAll(" ", "")
              : content;

            const totalChars = content.length;
            const wordCount = content.split(" ").length;
            setMinutesNeeded(Math.ceil(wordCount / averageWordsReadPerMinute));
            const sentenceCount = content.split(".").length;

            let letters = content.split("");
            letters = letters
              .filter((char) => /[a-zA-Z]/.test(char))
              .map((s) => s.toUpperCase());

            const group = Object.groupBy(letters, (letter) => letter);

            const densities = Object.entries(group).map((value) => ({
              letter: value[0],
              count: value[1] ? value[1].length : 0,
              percentage: value[1]
                ? (value[1].length / letters.length) * 100
                : 0,
            }));

            setMetrics({ totalChars, wordCount, sentenceCount, densities });
          } else {
            setMetrics({
              totalChars: 0,
              wordCount: 0,
              sentenceCount: 0,
              densities: [],
            });
          }
        }}
      >
        <textarea
          id="word-input"
          name="word-input"
          className="resize-none w-full h-[200px] p-5 border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 hover:border-neutral-600 focus:bg-neutral-800
         focus:outline-purple-500 focus:outline-2 focus:border-purple-500 rounded-xl mb-4"
          placeholder="Start typing here... (or paste your text)"
          maxLength={charLimit}
        />

        <section className="flex justify-between mb-10">
          <section className="flex gap-6 items-center">
            <input id="ch_exclude_spaces" name="spaces" type="checkbox" />
            <label htmlFor="ch_exclude_spaces" className="inline-flex gap-2">
              Exclude spaces
            </label>

            <input id="ch_limit" name="limit" type="checkbox" />
            <label htmlFor="ch_limit" className="inline-flex gap-2">
              Set character limit
            </label>

            {showCharLimitInput && (
              <input
                id="input_char_limit"
                type="number"
                value={charLimit}
                className="px-5 py-2.5 w-24 border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 hover:border-neutral-600 focus:bg-neutral-800
         focus:outline-purple-500 focus:outline-2 focus:border-purple-500 rounded-xl"
              />
            )}
          </section>
          <p>Approx. reading time: less than {minutesToRead}min</p>
        </section>

        <section className="grid grid-cols-3 gap-4 mb-10">
          <div className="relative py-6 px-3 bg-purple-500 rounded-xl text-black overflow-hidden">
            <h1 className="mb-2 font-bold">{metrics.totalChars}</h1>
            <h3>Total Characters</h3>
            <img
              className="absolute -right-7.5 top-0 h-36 opacity-80"
              src={shape1}
            />
          </div>

          <div className="relative py-6 px-3 bg-yellow-500 rounded-xl text-black overflow-hidden">
            <h1 className="mb-2 font-bold">{metrics.wordCount}</h1>
            <h3>Word Count</h3>
            <img
              className="absolute -right-7.5 top-0 h-36 opacity-80"
              src={shape2}
            />
          </div>

          <div className="relative py-6 px-3 bg-orange-500 rounded-xl text-black overflow-hidden">
            <h1 className="mb-2 font-bold">{metrics.sentenceCount}</h1>
            <h3>Sentence count</h3>
            <img
              className="absolute -right-7.5 top-0 h-36 opacity-80"
              src={shape3}
            />
          </div>
        </section>

        <h2 className="mb-4">Letter density</h2>

        <section className="flex flex-col mb-4">
          {metrics.densities
            .slice(0, allDensitiesShown ? -1 : 4)
            .map(({ letter, percentage, count }) => (
              <section
                key={letter}
                className="grid grid-cols-[1rem_auto_6rem] gap-4 items-center"
              >
                <p className="w-4">{letter}</p>
                <div className="relative w-full h-3 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    style={{
                      width: `${percentage}%`,
                      transition: "width 0.7s",
                    }}
                    className="h-full  bg-purple-500"
                  ></div>
                </div>
                <div className="text-right">
                  <p>
                    {count} ({percentage.toFixed(2)}%)
                  </p>
                </div>
              </section>
            ))}
        </section>

        <button type="button" onClick={() => setAllShowing(!allDensitiesShown)}>
          {allDensitiesShown ? "See less" : "See more"}{" "}
          {allDensitiesShown ? <span>^</span> : <span>V</span>}{" "}
        </button>
      </form>
    </main>
  );
}

export default App;
