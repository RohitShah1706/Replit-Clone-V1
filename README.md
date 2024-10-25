# Repl.it Clone

Browser can't run different types of code (eg. C++ or Rust or Go etc.) directly under the hood. It can use something like WebAssembly but it does not scale very well and also does not support all packages for all languages. This is what repl.it solves. It runs the code on the server and sends the output back to the browser.

# Why is building repl.it hard ?

### Remote code execution

Allowing users to execute any code on the server presents a significant security threat. It's crucial to implement a sandbox environment for code execution to mitigate this risk.

### Long running processes

Resources are allocated for code execution and must remain so until the user explicitly stops the process or disconnects from the server. If not managed correctly, this could lead to substantial resource depletion.

### Shell access inside browser

Implementing a shell-like interface within a browser is a complex task. It involves several potential challenges such as transmitting code to the server, retrieving and displaying the output with appropriate syntax highlighting, managing errors, and ensuring security measures are in place (for instance, preventing users from executing commands like `rm -rf /`).

### File Storage

It's essential to securely and efficiently store all user-generated files. This process involves managing file permissions to ensure users can only access their personal files, offering a method for users to retrieve their files, and maintaining file persistence even after the user session ends.

# Architecture of our `repl.it clone v1`

## Storing Initial Code Templates

Upon visiting the website, users are presented with a code editor pre-populated with default code corresponding to their chosen language or framework. This initial code is stored in an object storage service (like S3) and is retrieved when the user accesses the website.

For example, `base_go_code` is used for the Go language, `base_python_code` for Python, and `base_react_code` for a React project.

## Environment Setup and Initial File Transfer

The base code is transferred to a server where necessary dependencies are installed. For instance, a React project would require a setup with Node.js and React of appropriate versions. The root directory's contents are then sent to the user's browser, but only the top-level files and directories. Files within a directory are not immediately sent; they are transferred when the user opens the directory. Similarly, when a user double-clicks a file to open it, its contents are sent to the user's browser. This process is known as lazy loading.

### Why lazy loading?

- This approach reduces the amount of data sent to the user's browser, improving performance and reducing latency. It also allows for a more efficient use of resources on the server, as only the necessary files are transmitted.

- Lazy loading also allows for collaboration features, as changes made by one user are immediately sent to the server and then broadcast to all other users connected to the same environment.

## Real-time Changes and Persistence

Any modifications made by the user in the browser-based IDE are sent to the server via a websocket connection. However, only the differences, i.e., the changes made by the user, are transmitted. The server then applies these changes to the file in its file system. These files are also debounced to an object storage service (like S3) to ensure persistence even if the server crashes or restarts.

### What/Why debouncing?

- Debouncing is a technique used to limit the rate at which a function is called. In this context, it ensures that the changes made by the user are not sent to the object storage service too frequently, reducing the number of write operations and improving performance.

- Debouncing also helps prevent data loss in case of network issues or server crashes. By batching changes and sending them at intervals, the likelihood of losing user modifications is minimized.

## Cleaning Up

When a user disconnects from the server or explicitly stops the process, the server
cleans up the resources allocated for that user. This includes:

- Stopping the process executing the code
- Flushing any changes made by the user to the object storage service
- Removing the user's files from the server

# Limitations & how to overcome them

## Rudimentary Terminal

The `v1` of our repl.it clone will have a basic terminal-like interface that allows users to execute commands. This interface will be limited to a predefined set of commands, such as `ls`, `cd`, `cat`, and `echo`. This limitation is imposed to prevent users from executing potentially harmful commands. In `v2` we explore pseudo-terminal implementations to provide a more comprehensive terminal experience.

## Limited Scalability

All users share the same server in `v1`, which can lead to performance issues and resource contention. In `v2`, we will explore containerization technologies like Docker to isolate users' environments and improve scalability and nix-based package managers to install dependencies efficiently.

## Port Conflicts

Since all users share the same server in `v1`, port conflicts can arise when multiple users run code that requires the same port (eg - React application requiring port 3000). In `v2`, we will explore port forwarding techniques to dynamically assign ports to users' processes and avoid conflicts.

# Architecture of our `repl.it clone`

![Repl.it Architecture](<screenshots/Repl.it Architecture.png>)
![Repl.it Request Flow](<screenshots/Repl.it Request.png>)

# Pseudo Terminals (PTY)

References:

- [Medium article - Linux terminals, tty, pty and shell](https://dev.to/napicella/linux-terminals-tty-pty-and-shell-192e)
- [Youtube - What is a tty](https://www.youtube.com/watch?v=SYwbEcNrcjI)

Libraries used:

- [xterm.js](https://www.npmjs.com/package/@xterm/xterm): (client side) is a widely used library that enables the creation of terminal-like interfaces within a web browser. It offers a terminal emulator capable of executing commands and presenting the output. It allows us to capture and relay keystrokes to a server, where they are run in a pseudo-terminal (PTY) environment.

- [node-pty](https://www.npmjs.com/package/node-pty): (server side) is a Node.js module that provides an API for interacting with PTYs. It allows us to spawn a PTY process, send commands to it, and receive the output. This module is used in conjunction with `xterm.js` to create a full-fledged terminal experience within the browser.

# Setting up AWS S3 bucket locally with LocalStack

**References**:

1. [Setup AWS S3 bucket locally with LocalStack](https://dev.to/navedrizv/setup-aws-s3-bucket-locally-with-localstack-3n4o)
2. [Using Localstack to Emulate AWS S3 and SQS With Node](https://iamads.medium.com/using-localstack-emulate-aws-s3-and-sqs-with-node-d43dda1d71c0)

**Steps taken**:

1. Install and start LocalStack

```bash
# Install LocalStack
pip install localstack

# Start LocalStack in docker mode, from a container
localstack start -d

# Install awslocal, which is a thin wrapper around the AWS CLI that allows you to access LocalStack
pip install awscli-local
```

2. Create a new Local AWS Profile (called "localstack") to work with LocalStack

```bash
PS D:\Projects\Vercel Clone> aws configure --profile localstack
AWS Access Key ID [None]: test
AWS Secret Access Key [None]: test
Default region name [None]: ap-south-1
Default output format [None]:
```

3. Check if the profile is created

```bash
PS D:\Projects\Vercel Clone> aws configure list --profile localstack
      Name                    Value             Type    Location
      -                    --             -    --
   profile               localstack           manual    --profile
access_key     ****************test shared-credentials-file
secret_key     ****************test shared-credentials-file
    region               ap-south-1      config-file    ~/.aws/config
```

4. Create S3 bucket ("replit-clone-s3-bucket") with "localstack" profile

```bash
aws s3 mb s3://replit-clone-s3-bucket --endpoint-url http://localhost:4566 --profile localstack

# List all buckets
aws s3 ls --endpoint-url http://localhost:4566 --profile localstack
```

5. Copy a folder or file to the bucket

```bash
aws s3 cp ./target_folder s3://replit-clone-s3-bucket/ --recursive --endpoint-url http://localhost:4566 --profile localstack
```

6. List all files inside some bucket

```bash
aws s3 ls s3://replit-clone-s3-bucket/ --recursive --endpoint-url http://localhost:4566 --profile localstack
```

# Future improvements

## Protect websocket server

Put it behind some authentication mechanism.

## Limited priviliges to the user in runner service

Runner service has S3 credentials in environment variables. If someone gets access to the runner service, they can access the S3 bucket. We can limit the priviliges of the user in the runner service to only their `workspace` directory.

# Todo:

- Look xterm & PTY videos and understand how it works.

- Look into [Socket.io with xterm.js](https://github.com/jpcweb/xtermjs-socketio) - setup locally and understand how it works.

- Look into online IDE: [React Monaco File Tree](https://codesandbox.io/s/react-monaco-file-tree-ww9kis)

- Look into file watching library: [Chokidar on NPM](https://www.npmjs.com/package/chokidar)

- VSCode like editor components: [React-Ace on NPM](https://www.npmjs.com/package/react-ace)

- Look into only sending diffs to the server instead of the whole file.
