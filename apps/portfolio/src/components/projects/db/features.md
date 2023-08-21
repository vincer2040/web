### Features

- Handles multiple concurrent connections via multiplexing
    - Makes use of the `epoll` interface provided by Linux
    - Implementation of a state machine to dispatch read and write
    events emitted from the kernal - providing a more high level
    and easier to work with API
- Binary safe protocol
    - All messages must include a command that the server performs
    - The protocol used requires a type byte before the value
    - The length of arrays and strings must be after the type byte and before
    the value - the lengths are also used to ensure that the full message was read
    before executing the command
- Store key-value pairs in an efficient hashtable
    - Uses a bucket approach - the buckets are dynamic arrays rather than
    linked lists
    - A resizeable hashable is used to ensure an efficient load-factor
    - Siphash 1-2 is used to hash the keys
- Store relationships in a graph
    - Implemented as an adjacency list for more efficient memory usage
    - The ability to receive a graph from a client and construct it
    - Perform breadth-first and depth-first search on the adjacency list
- Create queues and stacks
    - Both implementations use a dynamic array
- Ability to categorize the data structures with namespaced collections
    - Uses a hash table where the key is the name of the namespace
    and the value is a structure containing a hashtable, adjacency list, hashset, queue,
    and stack
    - The data structures are only allocated once the users inserts the first value
    so that memory is not wasted
