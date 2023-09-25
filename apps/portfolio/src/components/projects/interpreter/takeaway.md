### Takeaway

This has been one of my favorite projects to implement so far.
Not only did I learn a lot about the parsing and execution of
programs, I also learned about just parsing strings in general.
It is very easy for programs to produce a string output, but parsing
a string input is much more difficult. I experienced this difficulty
quite a bit in the early implementations of [lexidb](/projects/db/)
when parsing the commands sent to the server. I actually adopted a
similar lexer/tokenizer/parser pattern in [lexidb](/projects/db/)
that was used in this project, and it simplified the process
tremendously.

In interpreted implementation, the execution of the input string representing
a program can be broken down into 3 steps:

1. Lexing - the input string is broken down into tokens, which are
much easier to work with than the input string itself. Consider the
following code:

```
let x = 5 * 5;
```

This string will be broken down to the following tokens:

```rs
[
    Token::Let,
    Token::Ident("x"),
    Token::Assign,
    Token::Int("5"),
    Token::Asterisk,
    Token::Int("5"),
    Token::Semicolon,
    Token::Eof,
]
```

This is the simplest part of the process, it turns the input string
into enums (which are extremely powerful in Rust), making the input
much easier to work with when parsing.

2. Parsing - the tokens are used to recursively build an AST. The above
code and tokens produces the followng AST:

```rs
Program {
    statements: [
        LetStatement(
            LetStatement {
                tok: Let,
                name: Identifier {
                    tok: Ident(
                        "x",
                    ),
                    value: "x",
                },
                value: InfixExpression(
                    InfixExpression {
                        tok: Asterisk,
                        left: Integer(
                            IntegerLiteral {
                                tok: Int(
                                    "5",
                                ),
                                value: 5,
                            },
                        ),
                        operator: Asterisk,
                        right: Integer(
                            IntegerLiteral {
                                tok: Int(
                                    "5",
                                ),
                                value: 5,
                            },
                        ),
                    },
                ),
            },
        ),
    ],
}
```

Parsing is the most complicated step of the process. In the language
implemented, almost everything is an expression - a group of words
or symbols that make up a value. The parser parses the expressions
by using a method very similar to Pratt parsing, described by
Vaughan Pratt in his book "Top Down Operator Precendence". Each token
maps to a specific _precedence_, which tells us when we need to parse
infix expressions, call expressions, and index expressions.

Consider the infix expression `5 * 5` as shown in the above code.
The current token and the peek (next) token are stored in the parser
struct. When parsing the expression, the parser first parses the first
5 with the lowest precendence. The parser sees the peek token is an
asterisk, which has a precendence that is higher than the lowest
precendence. This is when the parser realizes that it is actually parsing
an infix expression, and not just the integer 5. The parser will then
parse the right hand side of the expression, which in this case is also
5. This will continue while the peek token is not a semicolon and
the precendence the parse function was originially called with is less
than the peek token's precedence.

3. Evaluation - There are many ways the evaluation could have been
implemented: simply traversing the AST and executing the expressions
as we encounter them, converting the code to bytecode then running it
in a virtual machine (Java), or compiling the AST to native machine
code and executing it directly on the CPU. I am currently working on
compiling the AST to bytecode and running it in a virtual machine,
but I have implemented the method of traversing the AST - more often
referred to as a "tree-walking interpreter".

The AST is traversed in post-order, evaluating the expressions into
"objects." The language itself is not object oriented (rather, it
is actually more functional), but I needed a way to represent the values
in a way that Rust can understand them. The `Object` is an enum in Rust with
ten variants, as shown below:

```rs
pub enum Object {
    Null,
    Integer(i64),
    Boolean(bool),
    Return(std::boxed::Box<Object>),
    Error(String),
    Function(Function),
    String(std::sync::Arc<str>),
    Builtin(Builtin),
    Array(Array),
    Hash(Hash),
}
```

The example shown above is evaluated in the following way: again, the
AST is traversed in post-order, so the two 5's are evaulated first.
They are both represented in memory as `Object::Integer(5)`. Moving up
to the parent expression of the 5's (the infix expression), the evaluator
sees that we are performing a multiplecation of these two objects. It then
must do some checking to assert that the two objects are able to be multiplied
together (it cannot do `5 * "vince"` for example). Once it asserts that the
objects are of a proper type that can be multiplied, another object is created,
represented in memory as `Object::Integer(25)`. This object is then _bound_
to the variable `x`. This is done by inserting the value `Object::Integer(25)`
into a structure called the "Environment," which is where all the objects
that are bound to a variable with a let statement are stored. It is just
a hashtable, with the key being the name of the identifier and the value
being the object. The programmer can now access the variable like so:

```
print(x);
```

The value of `x` will be retrieved from the Environment and used as an
argument in the calling function.

I really love learning about how the internals of programming works, and
I believe that the best way to learn about something in programming is
to implement it yourself. During this project, I gained a much greater
understanding of how a lot of languages work, and am learning even more
now as I transition the interpreter from a "tree-walking" implentation
to a virtual machine that interprets bytecode.


