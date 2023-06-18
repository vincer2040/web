
## Interpreter

### about

This project was created by following "Writing An Interpreter in Go" by Thorsten Bell, but it was
writen in C instead of Go. Not only is it written in C, but it is also compiled with the c89 compiler.

### difficulties & future implementations

I'm still working on this project, so I would obviously like to finish the book before adding future implementations.
This project has been pretty simple so far, as Go is very similar to C, and I have been able to, for the most part,
do a one-to-one port of the Go code. However, this has also been my biggest difficulty, as Go is my least used language
(out of the more popular languages).

I would like the interpreter to be able to do all things that require a language to be considered a language, such as
reading and writing files, and networking.

### impact

In my opinion, This project has probably been one of the most important projects I have created. Although this
project is relatively simple, It has taught me a lot about how many interpreted languages, such as javascript
and python, run code.

This project has also taught me a lot about the power of abstraction, and the cost of such abstractions. The interpreter
allows code to be written much more clearly and elegantly compared to similar code written in a languade like C (clearly and
elegantly meaning not having to worry about memory allocations and deallocations), but much
more memory and computing time is needed to execute the program.
