### Overview

This is a string implementation that is used extensively in
[Lexidb](/projects/db/). This implementation allows me
to trivially interact with strings in C, which can be quite challenging
sometimes due to the nature of C. This is my favorite library I've created,
due to its simplicity and robustness.

Most third-party string implementations use a structure with a size,
capacity, and a pointer to the string. This implementation is similar, using
the structure shown below:

```c
typedef struct {
    size_t len;
    size_t cap;
} vstring_hdr;

typedef struct {
    vstring_hdr hdr;
    char data[];
} vstring;
```

This implementation is unique to most third-party libraries in that, rather than
returning the entire structure, it returns just the `data` field, making the header
internal and "hiding" it from the end user.
