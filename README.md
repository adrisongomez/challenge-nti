## PREREQUISITE:
 - [NVM](https://github.com/nvm-sh/nvm) (Node Version Manager)
 - `yarn`
 - `docker` and `docker-compose`
 - [direnv](https://direnv.net/)

## GETTING STARTED:

- Run `nvm use` which it's going to install the required Node.js version in this case v16.17.0
- Run `yarn` to install all of dependencies.
- Run `direnv allow` to load the enviroments variables on the `.envrc` file.
- In the `docker/` directory run `docker-compose up` which it's going to up the database.
- Run `npx prisma migrate dev` and later `npx prisma db seed` this is going to import the database scheme into your local database on docker and also add some initials record.
- Run `yarn dev` to startup the development server.
- (optional) Run `yarn test` to run the suite test.

# PROJECT OVERVIEW:

This is a Next.js, TypeScript and Prisma project.

Next.js is a fullstack framework of javascript with allow to create web application using React and Server Side Rendering.

Typescript is an superset of javascript which add more feature to language like types, interfaces, etc.

Prisma is an ORM framework which help to define Model to comunicate easely with your entities on DB.

The `prisma/schema.prisma` define all the database schema which the project is being use.

If you run all the commands you should have an user created which email `test@example.com` and password `12345678`

**Not all the project is complete on the front-end site**
Should be able to:
- Login with a valid user
- Logout
- And see all the customer on `/customers`

On the other site the backend is pretty much complete. If you want to see, which endpoint there are defined just check all `test/integrations/api/` files and it's going to show which endponts are expose and their contracts (payload : return value)

## ENVIROMENT VARIABLES

```bash
export POSTGRES_USER="<value>"
export POSTGRES_PASSWORD="<value>"
export POSTGRES_DATABASE_NAME="<value>"
export POSTGRES_HOST="<value>"
export POSTGRES_DATABASE_SCHEMA="<value>"
export POSTGRES_PORT="<value>"
export DATABASE_URL="postgresql://$POSTGRES_USER:$POSTGRES_PASSWORD@$POSTGRES_HOST:$POSTGRES_PORT/$POSTGRES_DATABASE_NAME?schema=$POSTGRES_DATABASE_SCHEMA"
export JWT_SECRET_ACCESS="<value>"
export JWT_SECRET_REFRESH="<value>"
export SALT_ROUND=00000
```
