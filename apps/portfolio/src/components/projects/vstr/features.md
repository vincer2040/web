### Features

- Binary safe strings
    - Most functions in the string standard library rely on the null
    terminator, making it difficult to work with strings containing binary
    data
    - Not relying on the null terminator allows users to insert
    whatever binary data they'd like in their strings
- Rather than returning a structure to the user, a pointer to the string is
returned
    - Allows trivial interaction with the C standard library
- Create formatted strings
- Trivially append strings and characters without having to worry
about ensuring the null terminator is not over-written or the buffer is
not overflowed
- Get the length of the string without having to rely on a null terminator

