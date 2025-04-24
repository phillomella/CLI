import { Command } from "commander";
import fs from "fs";
import { pipeline } from "stream";
import {
  performTask as task1,
  streamTransform as transformTask1,
} from "../tasks/task1.js";
import {
  performTask as task2,
  streamTransform as transformTask2,
} from "../tasks/task2.js";
import { handleConsoleInput } from "../utils/consoleHandler.js";

const program = new Command();

program
  .option("-i, --input <file>", "Input file")
  .option("-o, --output <file>", "Output file")
  .requiredOption("-t, --task <task>", "Task to perform")
  .parse(process.argv);

const options = program.opts();

if (options.input) {
  if (
    !fs.existsSync(options.input) ||
    fs.statSync(options.input).isDirectory()
  ) {
    console.error("Error: Input file does not exist or is a directory.");
    process.exit(1);
  }
}

if (
  options.output &&
  fs.existsSync(options.output) &&
  fs.statSync(options.output).isDirectory()
) {
  console.error("Error: Output file is a directory.");
  process.exit(1);
}

const tasks = {
  dash: {
    performTask: task1,
    transformTask: transformTask1,
  },
  inv: {
    performTask: task2,
    transformTask: transformTask2,
  },
};

if (!tasks[options.task]) {
  console.error(`Error: Task "${options.task}" is not implemented.`);
  process.exit(1);
}

const { performTask, transformTask } = tasks[options.task];

if (!options.input && !options.output) {
  console.log("введите значения в терминал");
  const transformStream = transformTask(options.task);

  pipeline(process.stdin, transformStream, process.stdout, (err) => {
    if (err) {
      console.error("Pipeline error:", err);
      process.exit(1);
    }
  });
} else if (!options.input) {
  handleConsoleInput((input) => {
    const result = performTask(input, options.task);
    if (options.output) {
      fs.writeFileSync(options.output, result);
    } else {
      console.log(result);
    }
  });
} else {
  const readStream = fs.createReadStream(options.input);
  const writeStream = options.output
    ? fs.createWriteStream(options.output)
    : process.stdout;

  pipeline(readStream, transformTask(options.task), writeStream, (err) => {
    if (err) {
      console.error("Pipeline failed:", err);
      process.exit(1);
    }
  });
}
