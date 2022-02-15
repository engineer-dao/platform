import { task } from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { TASK_TEST } from "hardhat/builtin-tasks/task-names";
import fs from "fs";
import path from "path";

const testFilePath = path.join(__dirname, '../test/lib/tokenInstructions.json');

const writeToTestFile = (instructions: string[]): Promise<void> => {
    return new Promise((resolve) => {
        fs.writeFile(testFilePath, JSON.stringify(instructions), {}, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            resolve();
        });
    });
}

task(
    'test-tokens',
    'Runs the tests multiple times with different ERC20 tokens as payment currency',
    async (taskArguments, hre: HardhatRuntimeEnvironment) => {
        console.log("--- Instructions 1 ---")
        await writeToTestFile([
            "add 1",
            "add 2",
            "use 2"
        ]);
        await hre.run(TASK_TEST);
        console.log("--- 1 COMPLETED ---")

        console.log("--- Instructions 2 ---")
        await writeToTestFile([
            "add 1",
            "add 2",
            "remove 1",
            "add 3",
            "remove 2",
            "use 3"
        ]);
        await hre.run(TASK_TEST);
        console.log("--- 2 COMPLETED ---")

        console.log("--- Instructions 3 ---")
        await writeToTestFile([
            "add 1",
            "remove 1",
            "add 1",

            "use 1"
        ]);
        await hre.run(TASK_TEST);
        console.log("--- 3 COMPLETED ---")
    }
);
