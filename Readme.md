# Introduction

This project is a boilerplate project for scala/sbt, which provides 4 subprojects 1) model 2) dao 3) service 4) web. Currently, there is no dependency for each sub-project but you can add easily. The dependency graph of the sub-projects as follow: web -> service -> dao -> model.

# Build

```bash
sbt compile
```

# Test

```bash
sbt model/run
```

```bash
sbt dao/run
```

```bash
sbt service/run
```

```bash
sbt web/run
```
# akka_training
