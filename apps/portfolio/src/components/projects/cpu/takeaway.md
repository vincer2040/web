### Overview

This project taught me a lot about bridging asynchronous programming
with synchronous programming as well as sharing data across multiple
threads. In rust, this is made very simple with tokio green threads and
broadcast channels. Green threads are different that OS threads in that
green threads are run in user space and OS threads are handled by the
operating system's kernel. This allows for some performance gains in some
instances as they do not require the overhead and complexity of interacting
with OS threads where the programmer would have to be extremely mindful of
how the threads access and modify the data, as well as the mutexes guarding
the data. This is why they are used extensively in other languages such as Go.
Tokio makes the process of sharing data very simple with the concept of channels.

