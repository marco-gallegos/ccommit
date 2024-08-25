#!/usr/bin/env node

const helpText =
  `CLI to autoformat commit as conventional commit specification including task id from your branch name.
      output format: <type><bc>(<scoope>): <message> <taskId>
      https://www.conventionalcommits.org/en/v1.0.0/

      Usage:
      npm run commit -- -bc -m "<message>" -s "<scoope>" -h
      npm run commit

      Tips:

      Use oh my zsh or oh my bash to quickly back select and avoid heavy command rewrites.
      https://ohmyz.sh/
      https://ohmybash.nntoan.com/

      If your commit is not catching task id you can always use git commit --amend to include it manuelly.

      Notes:

      - to pick task id from your branch bname use bitbucket branch name recomended name
      - if no params exist cli will request missing parts in the terminal (interactive mode).

      Params:
      
      -bc               (optional) Marks commit as Breaking Change (BC)
      -m "<message>"    (optional) Commit Message, iside quotes to enable spaces.
      -s "scoope>"      (optional) Commit scoope.

      examples:
      ## all in args
      npm run commit -- -bc -m "changing commit formating" -s chore
      
      ## just message in args all other params on interactive mode
      npm run commit -- -m "changing commit formating"

      ## all interactive
      npm run commit
      
      ## all interactive but as breaking change
      npm run commit -- -bc
      
      
      wrong examples:
      ## not -- included fails becuase is not catching all args
      npm run commit -bc -m "changing commit formating" -s kernel
      -- the right way -- >
      npm run commit -- -bc -m "changing commit formating" -s kernel
      
      ## no quotes in the spaced message is considered diferent params
      npm run commit -- -bc -m changing commit formating -s kernel
      -- the right way -- >
      npm run commit -- -m "changing commit formating" -s kernel
      
      ## no spaces after the param flag
      npm run commit -- -bc -m"changing commit formating" -skernel
      -- the right way -- >
      npm run commit -- -m "changing commit formating" -s kernel
      
      ## case sensitive
      npm run commit -- -Bc -M "changing commit formating" -S kernel
      npm run commit -- -bC
      npm run commit -- -BC
      -- the right way -- >
      npm run commit -- -bc -m "changing commit formating" -s kernel
`;
// Import necessary modules for console interaction
const readline = require('readline'); // Module for reading input from the console
const childProcess = require('child_process');

// Define commit types (e.g. feature, bug fix, etc.)
const commitTypes = [
  { id: 0, value: 'chore', description: 'Task related to project configuration or maintenance' },
  { id: 1, value: 'feat', description: 'New function or feature' },
  { id: 2, value: 'fix', description: 'Bug fix' },
  { id: 3, value: 'test', description: 'Unit tests or integrations' },
  { id: 4, value: 'perf', description: 'Performance optimization' },
  { id: 5, value: 'docs', description: 'Documentation updates' },
  { id: 6, value: 'style', description: 'Code formatting and style' },
  { id: 7, value: 'build', description: 'Changes in project compilation' },
  { id: 8, value: 'refactor', description: 'Code refactoring' }
];

// Function to print the list of commit types with numbers.
function printCommitTypes() {
  console.log('Select a commit type:');
  for (const type of commitTypes) {
    console.log(`${type.id} - ${type.value}: ${type.description}`);
  }
}

// Helper functions
async function getCommitType() {
  const readlineInstance = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  printCommitTypes();

  return new Promise((resolve) => {
    readlineInstance.question('Select a commit type (enter the number): ', async (response) => {
      if (!isNaN(response) && !!commitTypes[parseInt(response)]) {
        const selectedCommitType = commitTypes[parseInt(response)]?.value;
        resolve(selectedCommitType);
      } else {
        console.error("Invalid choice, please choose from list");
        process.exit(1); // Exit with error code for invalid input
      }
      readlineInstance.close();
    });
  });
}

async function getTaskId() {
  return new Promise((resolve) => {
    const gitCommand = 'echo $(git branch --show-current) | sed -n "s/.*\\(IT-[0-9]*\\).*/\\1/p"';
    childProcess.execSync(gitCommand)
      .toString()
      .trim()
      .split('\n')
      .map((line) => line.trim())
      .forEach((branchName) => {
        resolve(branchName);
      });
  });
}

async function getCommitMessage() {
  return new Promise((resolve, reject) => {
    const readlineInstance = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    readlineInstance.question('Enter a commit message: ', async (messageInput) => {
      resolve(messageInput);
      readlineInstance.close();
    });
  });
}

async function getCommitScope() {
  return new Promise((resolve, reject) => {
    const readlineInstance = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    readlineInstance.question('Enter a scope (optional): ', async (scopeInput) => {
      resolve(scopeInput);
      readlineInstance.close();
    });
  });
}

async function main() {
  let commitScope = '';
  let commitMessage = '';
  let commitIsBreakingChange = false;
  let taskId = '';

  const requestingHelp = process.argv.indexOf('-h');

  if (requestingHelp !== -1) {
    console.log(helpText);
    process.exit(0); // success exit
  }

  const commitType = await getCommitType();

  taskId = await getTaskId();

  // Check if there's an option for the scope
  const scopeIndex = process.argv.indexOf('-s');
  if (scopeIndex !== -1 && scopeIndex < process.argv.length - 1) {
    // If so, use it as the commit scope
    commitScope = process.argv[scopeIndex + 1];
  }
  // Check if there's a message provided on command line
  const messageIndex = process.argv.indexOf('-m');
  if (messageIndex !== -1 && messageIndex < process.argv.length - 1) {
    // If so, use it as the commit message
    commitMessage = process.argv[messageIndex + 1];
  }

  // Check if there's a breaking change provided on command line
  commitIsBreakingChange = process.argv.indexOf('-bc') !== -1;

  if (!commitScope) {
    await getCommitScope().then((scopeInput) => {
      commitScope = scopeInput;
    });
  }

  if (!commitMessage) {
    await getCommitMessage().then((messageInput) => {
      commitMessage = messageInput;
    });
  }

  const formattedMessage = `${commitType}${commitIsBreakingChange ? '!' : ''}(${commitScope}): ${commitMessage} ${taskId}`;

  const gitCommand = `git commit -m "${formattedMessage}"`;
  console.debug(gitCommand);
  childProcess.exec(gitCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing commit: ${error}`);
      return;
    }
    console.log('Commit created successfully!');
  });
}

main();
