### Takeaway

This project taught me many things, with the most important,
in my opinion being networking. When I first began this project,
I was using HTTP as the protocol for communicating with the
server. This was largely due to me being naive of anything
other than a simple JSON rest api. I soon realized that there must
be a better way to communicate with the server, which is what
inspired me to create my own protocol. During this process, I quickly
learned that _nothing_ sent over the network is typesafe, and
how delecate some servers can be when the client does not
adhere to the protocol specification.

In the beginning of this project, I had no idea how non-blocking
architectures worked, or, quite frankly, that they were a thing. I
had no idea how to handle multiple connections to the server, and
my solution in the beginning was to use multiple threads,
This was an extremely naive solution, as the
number of availale connections was limited to the number of cores
on my machine. After some research, I came across APIs such as `select`,
`poll`, and `epoll`. These interfaces allow their users to handle
many connections to the server due much more trivially than a
multi-threaded architecture. I was able to create a state machine
interface with the `epoll` API, which, indirectly, taught me a lot
about how other non-blocking architectures, such as node.js, work.
Consider the following code in node:

```js
import { Socket } from "net";

let sock = new Socket();

sock.on('data', (data) => {
    console.log(data);
});
```

The `on` method takes in an event to listen for, as well as
a callback function to be called when the event is fired.
This is a very similar interface to the one I create for
this project. Here is a very basic and somewhat contrived example
usage of the library:

```c

int sfd = create_tcp_socket();

De* de = de_create(BACKLOG);

void read_from_client(De* de, int fd, void* client_data, uint32_t flags) {
    char buf[READ_MAX] = { 0 };
    int r = read(fd, buf, READ_MAX - 1);
    printf("%s\n", buf);
}

void server_accept(De* de, int fd, void* client_data, uint32_t flags) {
    int client = tcp_accept(fd);
    de_add_event(de, client, DE_READ, read_from_client, client_data);
}

de_add_event(de, sfd, DE_READ, server_accept, data);

```

The `de_add_event` function takes the `De` internal data structure, file descriptor,
the event type to listen for, in this case, `DE_READ`, a callback function, and
data that should be passed to the callback function. This is very similar to the
`on` method in node, but with less syntactic sugar.






