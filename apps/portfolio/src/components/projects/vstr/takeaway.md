
### Takeaway

Originally, I was writing the [interpreter](/projects/interpreter/)
project in C, and this library would be used as there was a lot
of string operations in that project. I ended up rewriting the
project in Rust simply due to the power of Rust enums, but that's
beside the point. Now, this project is used extensively in
[lexidb](/projects/db/) as I needed a string implementation
that could handle having binary data in buffer. It is also used
in the CLI for lexidb, for trivially reading input from the user
without causing a buffer-overflow.

This library also has a couple users, which leads me to the biggest
takeaway from this project, and that is to build in public.
It is a very good feeling knowing that some other programmer is
using my code because it enables them to make better software, and
I hope I get to continue to feel this feeling as I continue in my career.
Building this project in public also has given me the opportunity to
hear feedback from someone who isn't my professor (not that I don't like
my professor's feedback - I found it extremely valuable to have
more than one person's feedback).

The second biggest takeaway that I got from this project was that
it is _extremely_ difficult to write good, _safe_ C code. There is
a lot you have to account for, as well as abide by the standard, which
can be rather unintuitive at times. For example, I had to use this
quite ambigous line of code to ensure that the correct pointer was
returned to the user and the correct amount of offset was substracted
from the data pointer to get to the internal header structure:

```c
#define VSTRING_OFFSET (intptr_t)(&((vstring*)NULL)->data)
```

What's happening here is we are taking the `NULL` pointer, which
is effectively 0, casting it to a `vstring`, which is the internal
data structure of the string, and reading the length of the offset
to the data field, which is where the pointer is located that is
returned to the user, and casting it to an `intptr_t` which is the
number of bytes between the start of the `vstring` structure and
the data field. This must happen because, according to the standard,
the compiler may add padding between fields of a struct, and simply
using the size of `vstring_hdr` as the offset would result in
undefined behavior on some architectures.

Speaking of undefined behavior, another ambigous thing I had to
do was check to make sure that the length or the capacity fields
of the structure never overflows, as well as make sure that they
are alway smaller than `SIZE_MAX`. Take this function for example:

```c
vstring* vstring_new_len(size_t initial_cap) {
    vstring* vstring_obj;
    size_t tmp_inital_cap = initial_cap;
    size_t needed_len = sizeof(vstring) + initial_cap + 1;

    if (needed_len < tmp_inital_cap) {
        // we have overflowed
        fprintf(stderr, "vstr failed to allocate in vstr_new_len, capacity is too large\n");
        return NULL;
    }

    if (needed_len > SIZE_MAX) {
        fprintf(stderr, "vstr cannot allocate a string larger than size max (vstr_new_len)\n");
        return NULL;
    }

    vstring_obj = vstr_malloc(needed_len);
    if (vstring_obj == NULL) {
        return NULL;
    }

    memset(vstring_obj, 0, needed_len);
    vstring_obj->hdr.len = 0;
    vstring_obj->hdr.cap = initial_cap + 1;

    return vstring_obj;
}
```

This is an internal function that allocates a `vstring` structure
based on an initial capacity passed by the user. We check if
the `needed_len` is less than the `initial_cap`, which seems impossible
as we have just added the `initial_cap` to the size of a `vstring` to
compute `needed_len`, but, if the initial capacity is large enough,
it would cause the `needed_len` to overflow. I know that overflowing
signed integers is defined by the standard, but overflowing on signed integers
is undefined behavior. The reason I worried about this was due to this
scary example:

```c
void my_func(unsigned short a, unsigned short b) {
    unsigned int x;
    x = a * b;
    if (x >= 0x80000000)
        printf("%u >= %u\n", x, 0x80000000);
    else
        printf("%u < %u\n", x, 0x80000000);
}

my_func(65535, 65535);
```

In the example, `4294836225 < 2147483648` will be logged. How? We are
using unsigned integers, so nothing here is undefined behavior, right?
Well, the compiler actually does some transformations to the above code,
which results in the following:


```c
void my_func(unsigned short a, unsigned short b) {
    unsigned int x;
    x = (unsigned int)((int)a * (int)b);
    if (x >= 0x80000000)
        printf("%u >= %u\n", x, 0x80000000);
    else
        printf("%u < %u\n", x, 0x80000000);
}

my_func(65535, 65535);
```
The change is rather small, but it is extremely devestating; it casts `a` and `b`
to signed integers, which now means that overflowing is undefined, so the
compiler will again transform the code to the following:

```c
void my_func(unsigned short a, unsigned short b) {
    unsigned int x;
    x = (unsigned int)((int)a * (int)b);
    printf("%u < %u\n", x, 0x80000000);
}

my_func(65535, 65535);
```

As you can see, the compiler completely removed the if statement, because
overflowing signed integers is undefined behavior, so now you get to be
extremely confused when the program prints `4294836225 < 2147483648`.

Coming back to the function `vstring_new_len`, I was very relieved when I
plugged the code into Matt Godbolt's [compiler explorer](https://godbolt.org/) and
saw that the compiler did not optimize out the if statements checking for
overflows, but it is something that I had to be careful about when writting this
library.

