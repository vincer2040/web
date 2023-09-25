### Overview

This is a simple cli written in Ocaml that scaffolds projects for me. I really enjoy starting
side projects, and I noticed that I am doing a lot of copying and pasting
of configuration files from previous projects. This cli removes that process,
and allows me to immedietly start developing the project without having
to worry about the setup.

The original goal for this project was to be a higher level build tool
for cmake, as well as a package manager. The latter proved to be rather challenging,
and required the user to create a configuration file in the project for the cli, which is
something I wanted to avoid - another complicated build configuration file that
is abstracted over other complicated build configuration file.
