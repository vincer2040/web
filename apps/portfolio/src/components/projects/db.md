
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

The main challenges when developing this project were similar to the challenges faced when developing almost anything
with C: memory management and shared mutable state. Since C is a procedural langauge without classes and
namespaces, ensuring the integrity of the state of the program can be difficult. The current solution for
this is seperating the components that make up the shared state into seperate "modules". The variables
that represent the state were made private to the rest of the program. Here is a quick example of how this was
done:

```c
/*user.h*/
#ifndef __USER_H__
#define __USER_H__

#ifdef __INTERNAL_USER_H__
typedef struct{
    int id;
    char* name;
}User;
#else
typedef void User;
extern char* get_user_name(User* user);
extern int get_user_id(User* user);
#endif/*!__INTERNAL_USER_H__*/

#endif /*!__USER_H__*/
```

```c
/*user.c*/
#define __INTERNAL_USER_H__
#include "user.h"

char* get_user_name(User* user)
{
    return user->name;
}

int get_user_id(User* user)
{
    return user->id;
}
```

```c
/*main.c*/
#include "user.h"

int main()
{
    User* user = create_user(id, name);
    printf("%s\n", get_user_name(user));
    return 0;
}
```

In this example, when the user.h is included in a file where `__INTERNAL_USER_H__`
is defined, `User` is a defined type that is not void, and when it is not defined,
`User` is typed to void. This ensures that no fields of the struct can be accessed
unless the function `get_user_name` or `get_user_id` is explicitly called. This
is not a full proof solution, but it works well for the current state of the project.

The difficulties with memory management were solved by using tools such as Valgrind,
which is a program that detects memory leaks and is an incredible tool for debugging.
Again, this is likely not a full proof solution, but it works well for the current
state of the project.

### Future

I have many feature ideas for this project that I'd love to implement; but before I implement
more, I want to harden the core of the project. Currently, the program's integrity is still
reliant on the user using the program correctly. There are a lot of cases I believe I have covered,
but I assume there are much more than what I have already covered. I believe this
is a problem for all software, but a database should mitigate this as much as possible.

With the current trends, I have struck an interest in machine learning.
I think being able to create neural networks in the same place that the data would be a
powerful feature.Although it could be considered slightly outside of the scope of the project,
I believe that AI will continue its grows in the technology used everyday.


