
## DB

### about

This project (LexiDB)  was inspired by Redis, a powerful in-memory database. LexiDB is an in-memory
database that allows users to interact with different data structures. The data structures with which
the user can interact with include a hashtable, a collection of hashtables, a hashset (mainly used for
indexes), a radix tree, and a vector. Users communicate with the server via commands.

### server architecture

The server is no more than a TCP socket. Users communicate with the server using a protocol similar to
the RESP protocol used by redis. The protocol requires that the length of strings and arrays send to the
server with a command be prepended to the message sent by a user. This ensures that an entire command
is read before operating the specific command. The protocol is also binary safe, so sending and receiving
integers in their binary form can happen.

The server uses a non-blocking mechanism to enable multiple simultaneous connections. As a result, the program
can only run on linux distributions that support epoll. In the future, I would like to implement kqueue so that
the program can be run on macos.

The server currently keeps track of its operations by dumping the binary messages that it receives
to a logfile. The buffer that is written to the logfile is a region of shared memory that is shared across a fork
call that is executed at the begginning of the program.

### difficulties & future implementations

The main difficulty I encountered during the development of this project is ensuring that the full message
sent by a user is read before a command is sent. It may sound that this should be rather simple due to the
nature of the protocol, but the actual implementation of ensuring that the entire message was read was extremely
difficult, and I still don't think I have discovered the best way to do it. It is difficult to keep track of
the state of the protocol when parsing two seperate messages that conntain one command.

Another difficulty, one which I am currently struggling with, is a search feature. I will use the radix tree that
I have implemented in order to create the search feature, but I am currently struggling with a method to iterate
over all of the potential matches. The main difficulty I am having with iterating over all of the potential matches
is fuzzying the inputs; ie, when a user searches for "dg" in a radix that includes "dog", dog will still be returned
even though the "o" in "dog" was skipped in the search.

Another difficulty I am currently struggling with is creating a better mechanism for persisting the data structures
created on disk. Currently, the only logging mechanism used by the server is via the shared memory block discussed
above. In the future, I would like to implement a mechanism that allows these data structures to be written to a file
in the format that they appear in memory.

### impact

This project has almost completely changed the way I program.

### misc.

#### client libraries

There are currently libraries that are a facade for interacting with the database. A client has been implemented for
the following languages: C, Rust, C++, Typescript/Javascript, Java, Python, and Go. They each follow the same general pattern;
a structure for building the message to be sent to the server, a structure for parsing the message received from the
server, and a structure that encapsulates the former structures and the socket that is created to connect to the server.

The structures that build the message to be sent to the server implement the builder pattern, which allows for easy and
human readable syntax for building binary messages. The structures that parse the messages received from the server follow
the same general pattern that the database follows when parsing messages it receives. Finally, the base structure that
is the public interface of the client that encapsulates the protocol builder, parser, and the socket that is used to
communicate with the server.
