### Takeaway

This is one of my favorite projects I've
worked on. There was something extremely satisfying
about typing code into the REPL and seeing it
_actually_ work. Before this project, I had a vague
idea of how interpreted languages worked. I knew
they have a tokenizer and a parser that generates
an abstract-syntax tree (AST) due to my experience with
tree-sitter playground, but I had no idea how these
trees were evaluated. I learned that it was actually
rather trivial. Consider the following code:

```
let x = 10;

let isGreater = fn(y) {
    if (y > x) {
        return true;
    } else {
        return false;
    }
}

isGreater(20);
```

The above code produces the following AST:

```
Statement { type = LET_STATEMENT, name = "x", value = Expression { type = INTEGER, value = 10 } }

Statement { type = LET_STATEMENT, name = "isGreater", value = Expression {
    type = "FUNCTION", parameters = [ "y" ], body = [
        Statement { type = EXPRESSION, expression = Expression {
            type = IF_EXPRESSION,
            condition = Expression { type = INFIX,
                left = Expression { type = IDENTIFIER, name = "y" },
                oper = ">",
                right = Expression { type = IDENTIFIER, name = "x" }
            },
            consequence = Statement {
                type = RETURN_STATEMENT, value = Expression { type = BOOLEAN, value = true }
            },
            alternative = Statement {
                type = RETURN_STATEMENT, value = Expression { type = BOOLEAN, value = true }
            }
        }
    ] }
} }

Statement { type = EXPRESSION, value = Expression {
    type = CALL,
    fn = Expression { type = IDENTIFIER, name = "isGreater" },
    arguments = [
        Expression { type = INTEGER, value = 20 },
    ]
} }
```

In this AST, there are three statements at the root level. The first one
binds the variable `x` to the integer 10. When this happens, an integer
object is allocated, and inserted into the environment. The environment
has this structure:

```c
typedef struct {
    vstr name;
    Object* obj;
} EnvironmentItem;

typedef struct {
    size_t len;
    size_t cap;
    EnvironmentItem items[];
} Environment;
```

Objects have this structure:

```c
typedef struct {
    int refcount;
    enum {
        O_INT,
        O_BOOLEAN,
        O_STRING,
        O_FUNCTION,
        O_ARRAY,
        O_MAP,
    } type;
    union {
        int64_t integer;
        bool boolean;
        vstr string;
        Environment* env;
        struct Vec* array;
        struct Ht* map;
    } data;
} Object;
```

So, the first statement allocates the object with
type `O_INT` and `data.integer` is set to 10. This object
is then inserted into the environemnt with the associated
name "x".
