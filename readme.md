# ccommit

ccommit is a CLI to create quickly git commits using the conventional commit specification.

## versions

### V1 (current)

Simple 0 dependency script to quickly commit in the terminal with basic validations.

### V2 (incoming WIP)

New version including the same features on V1 but using fancy libraries, new features and better UX.


## how this works?

```mermaid
flowchart TD
    a((inicio)) --> b
    b[cli call] --> c 
    c[args validation] --> d{commit type exist?}
    d -- no --> e
    e[request type input] --> f
    d -- si --> f{commit scoope exists?}
    f -- no --> g
    g[request scoope input] --> h
    f -- si --> h{commit message exists?}
    h -- no --> j
    j[request message input] --> l
    h -- si --> l
    l[get extras ej: branch names parts etc] --> m
    m[generate commit string] --> n
    n[execute commit] --> fin((fin))
```
