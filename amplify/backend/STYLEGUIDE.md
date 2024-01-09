# Style Guide for Backend Development

For backend development, the following rules should be upheld to ensure consistency.

## API Routes

* All API routes should begin with ```/v1/```

## API Functions

* An API shoud **always** return a response code.
* Errors should be returned as json in the format ```{error: "Explaination"}```.

### HTTP Methods

* Items which have an **autonumber** should use a ```POST``` request.
* Items which have a client determined identifier **(such as staff)** must use a ```PUT``` request.