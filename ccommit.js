#!/usr/bin/env node
var l=`CLI to autoformat commit as conventional commit specification including task id from your branch name.
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
`,m=require("readline"),p=require("child_process"),a=[{id:0,value:"chore",description:"Task related to project configuration or maintenance"},{id:1,value:"feat",description:"New function or feature"},{id:2,value:"fix",description:"Bug fix"},{id:3,value:"test",description:"Unit tests or integrations"},{id:4,value:"perf",description:"Performance optimization"},{id:5,value:"docs",description:"Documentation updates"},{id:6,value:"style",description:"Code formatting and style"},{id:7,value:"build",description:"Changes in project compilation"},{id:8,value:"refactor",description:"Code refactoring"}];function u(){console.log("Select a commit type:");for(let e of a)console.log(`${e.id} - ${e.value}: ${e.description}`)}async function d(){let e=m.createInterface({input:process.stdin,output:process.stdout});return u(),new Promise(n=>{e.question("Select a commit type (enter the number): ",async t=>{if(!isNaN(t)&&a[parseInt(t)]){let o=a[parseInt(t)]?.value;n(o)}else console.error("Invalid choice, please choose from list"),process.exit(1);e.close()})})}async function f(){return new Promise(e=>{p.execSync('echo $(git branch --show-current) | sed -n "s/.*\\(IT-[0-9]*\\).*/\\1/p"').toString().trim().split(`
`).map(t=>t.trim()).forEach(t=>{e(t)})})}async function h(){return new Promise((e,n)=>{let t=m.createInterface({input:process.stdin,output:process.stdout});t.question("Enter a commit message: ",async o=>{e(o),t.close()})})}async function y(){return new Promise((e,n)=>{let t=m.createInterface({input:process.stdin,output:process.stdout});t.question("Enter a scope (optional): ",async o=>{e(o),t.close()})})}async function v(){let e="",n="",t=!1,o="";process.argv.indexOf("-h")!==-1&&(console.log(l),process.exit(0));let g=await d();o=await f();let s=process.argv.indexOf("-s");s!==-1&&s<process.argv.length-1&&(e=process.argv[s+1]);let c=process.argv.indexOf("-m");c!==-1&&c<process.argv.length-1&&(n=process.argv[c+1]),t=process.argv.indexOf("-bc")!==-1,e||await y().then(i=>{e=i}),n||await h().then(i=>{n=i});let r=`git commit -m "${`${g}${t?"!":""}(${e}): ${n} ${o}`}"`;console.debug(r),p.exec(r,(i,w,C)=>{if(i){console.error(`Error executing commit: ${i}`);return}console.log("Commit created successfully!")})}v();
