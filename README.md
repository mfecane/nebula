## TODO:

- remove filter by point numbers qhe??
- make red dimmer
- save scroll on media change
- add contacts by shrink works this suck
- add adaptive
- add fingeer manipulation
- figure out how to use fucking partials
- can scroll up down only in the middle of element, show it with cursor
- add transition 3ms to all anim styles
- replace cursor with mouse to show scrolling
- make scroll timeline only timeline
- keyframe-based api
- clean up shaders
- put exp and works and all the content into single container sroll there, and move that container
- layout contacts
- remove unused fonts

## ideas

- interlacion
- Save this color #0d1014

## STUFF

### GIT STUFF

    git config --global alias.s status
    git config --global alias.l "log --oneline -n5"
    git config --global alias.ll "log -n2"
    git config --global alias.cm "!git add -A && git commit -m"
    git config --global alias.co checkout
    git config --global alias.cm "!git add '.' && git status && git commit"
    git config --global alias.cam "!git add '.' && git status && git commit --amend --no-edit"

    git config --global alias.wip "!git add '.' && git status && git commit -m 'WIP'"
    git config --global alias.rewip "!git cam"
    git config --global alias.unwip "!git log --oneline -n5 && git reset --mixed HEAD^ && git status"

    git config --global alias.posu "!git push origin --set-upstream "

    git config --global --unset alias.am
