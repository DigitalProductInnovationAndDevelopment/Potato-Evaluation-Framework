# Potato-Evaluation-Framework
Prototype to address the challenge of a potato evaluation framework

## Setup

In order to run the system, you need to Docker on your machine/server. \
Please refer to: https://docs.docker.com/engine/install/

```bash
# To build and run project
$ make build-and-run

# To build project
$ make build

# To run project
$ make run

# To stop project
$ make stop

# To see logs
$ make logs
```
### Branching

The project uses a similar strategy like git-flow.

Branches should follow this naming convention:

**[JIRA-ID]/[SHORT-DESCRIPTION]** (e.g. KD-01/user-registration).

### Commit messages

Commit messages should follow this naming convention: **[JIRA-ID] [Change description]** (e.g. _[KD-01] Add functionality to register users._)

The messages should have a clear separation of subject and body with a blank line.

e.g.

```
[TECH-01] Add functionality to register users.
...
```