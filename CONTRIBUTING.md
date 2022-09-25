# Contributing Guide

Welcome! So you decided to contribute to this project. Well before you begin go through our guide on how to contribute to this project

**NOTE - Please don't use issue tracker to ask questions and help. Instead use [Dicsussions](https://github.com/AmishFaldu/Swagger-Docs/discussions) channel to ask your question, seek help from others and see all announcements.**

## How you can contribute

You can contribute in any way possible to help this project reach maximum audience and use.

It can be spreading news to your friends and community, showing a demo at a conference, creating a PR for open issues, improving documentation, sharing new ideas on improving this project, creating bug reports, creating feature requests, improving swagger UI to make it more beautiful and elegant to interact with.

## So you found a Bug?

Well what are you waiting for then. If you find a bug in the source code, you can help us by
[submitting an issue](#submit-issue) to our [GitHub Repository](https://github.com/AmishFaldu/Swagger-Docs). Even better, you can
[submit a Pull Request](#submit-pr) with a fix.

## <a name="submit-issue"></a> Submitting an issue

Before you submit an issue, please search the issue tracker, maybe an issue for your problem already exists and the discussion might inform you of workarounds readily available.

We want to fix all the issues as soon as possible, but before fixing a bug we need to reproduce and confirm it. In order to reproduce bugs please provide a minimal reproduction scenario using a repository or [Gist](https://gist.github.com/). Having a reproducible scenario gives us wealth of important information to fix bug.

You can file new issues by filling out our [new issue form](https://github.com/AmishFaldu/Swagger-Docs/issues).

## <a name="submit-pr"></a> Submit a Pull Request (PR)

Before you submit your Pull Request (PR) consider the following guidelines:

1. Search [GitHub Pull Requests](https://github.com/AmishFaldu/Swagger-Docs/pulls) for an open or closed PR
   that relates to your submission. We don't want you to duplicate your valuable efforts.
2. Fork this repository.
3. Make your changes in a new git branch. This branch should follow proper naming conventions as per [git rules](#git-rules).
4. Create your patch.
5. Follow our [Coding Rules](#coding-rules).
6. Commit your changes using a descriptive commit message that follows
   [commit message conventions](#git-rules). Adherence to these conventions
   is mandatory.
7. Push your branch to GitHub.
8. In GitHub, send a pull request to `Swagger-Docs:master`.

- If we suggest changes then:
  - Make the required updates.
  - Commit changes and update your PR.

That's it folks! Thank you for your valuable contribution!

## <a name="coding-rules"></a>Coding rules

When contributing to this project you should follow these coding patterns.

1. Create variables with clear, easy-to-read name and meaning.
2. Write comments above every function, which clearly mentions what this function is doing.
3. Follow eslint rules and avoid disabling them at all cost. There may be times when disabling is the only option, then write a note when you raise a PR about why you have disabled rules in code.
4. When you write a complex to understand logic write a short comment on what the code is doing and why you have preferred that way.

## <a name="git-rules"></a>Git commit message guidelines

We follow commit conventions on how our git commit messages can be formatted. This leads to **more
readable messages** that are easy to follow when looking through the **project history** and track down changes.

We follow [this guide](https://gist.github.com/qoomon/5dfcdf8eec66a051ecd85625518cfd13) for writing conventional commit message and branch name. Make sure that you follow this pattern when creating new branches and while commiting your changes
