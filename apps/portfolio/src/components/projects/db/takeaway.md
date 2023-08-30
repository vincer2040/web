### Takeaway

This project taught me many things, with the most important,
in my opinion being networking. I believe the most
important lession I learned about networking from this project
is that _nothing_ sent over the network is type safe, and this
is why network protocols exists. Not only do they provide
a specification to communicate, they also provide a _decent_
amount of typesafety, as long as the client abides by the
specification.

I also learned about how non-blocking architectures work.
Indirectly, I learned a lot about how node.js works (which
is effectively just libuv + v8). Consider the following code
in node:

```js
import { Socket } from "net";

let sock = new Socket();
sock.connect();

sock.on('data', (data) => {
    console.log(data);
});
```

The `on` method takes in an event to listed for, as well as
a callback function to be called when the event is fired.
This is a very similar interface to the one I create in
the event library for this project. Here is a very basic
and somewhat contrived example of usage of the library:

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






