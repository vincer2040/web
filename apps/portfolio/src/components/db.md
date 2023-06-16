
## DB

### Introduction

This is an in-memory database written in C that offers high-performance data storage
and retrieval capabilities. This project showcases an implementation of an event driven
architecture, a communication protocol for binary-safe data transfer, and multiple types of
data structures.

### Features

1. Async IO

    - Rather than using threads, an interface wrapping an `epoll` instance is used by the server to handle
    multiple connections concurrently

    - The interface accepts callback functions to be called when `read` and
    `write` events are emitted from the kernal

2. Binary-Safe Protocol

    - The protocol requires a byte before the data to specify the type of data (array, integer, or string)

    - For arrays and strings, the protocol requires the length of the data to be prepended aswell

3. Hashtable

    - The server uses a hashtable with bucket storage as the primary database

    - The buckets are vectors rather than linked lists

5. Clusters

    - Clusters can be used by clients to create a seperate namespace for more organized data

    - The clusters are stored in a hashtable, and each cluster contains an index, as well as a
    radix trie tree

5. Indexing and Searching

    - The server uses a hashset data structure for indexing.

    - A radix trie tree is used for searching

6. CLI and TUI

    - The database ships with binaries for a CLI and TUI.

    - The CLI allows easy communication with the server, as well as some help getting started

    - The TUI offers an easy way to view multiple components of the data at the same time

7. Client Libraries

    - There are curretly libraries for C, C++, Typescript/Javascript, Java, Go, Rust, Python, and Ocaml.


### Challenges

### Future


