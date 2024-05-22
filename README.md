# Courses-Rest-ExpressMongoDB
Project for the course Node.js, Express, MongoDB &amp; More: The Complete Bootcamp 2024

## The course

https://www.udemy.com/course/nodejs-express-mongodb-bootcamp

## The stack

This includes (mainly):

 - Create rest CRUD with typescript
 - Create mongo database
 - Authentication 

## Aditional features

Also added: 

- Testing practices with Jest and Superuser
- Docker mongo container
- 
# Source

# Notes

To establish a successful MongoDB connection, you'll need to create a file named 'env.conf' at the root level of your project. This file should contain the URL of the database and the name of the database itself.

```bash
DATABASE_CONECCTION_DOCKER=<the_url>
```

# Configuring mongo db and docker

## Create docker container

https://github.com/themattman/mongodb-raspberrypi-docker

follow this one as well

https://www.mongodb.com/developer/products/mongodb/mongodb-on-raspberry-pi/


## Connect with volume

```bash
#Run
docker run -d -v /home/pi/data/mongodbexpress/:/data/db -p 27017:27017 mongodb-raspberrypi4-unofficial-r7.0.4 --auth

#Connect
docker exec -it b3c6e4fd4abc bash

#Create user to connect from external
use admin
db.createUser( { user: "admin", pwd: "SUPERSECRETPASSWORD", roles: [ "userAdminAnyDatabase", "dbAdminAnyDatabase","readWriteAnyDatabase"] } )

#See the users created (admins) 
use admin
db.system.users.find()

#The users can be created per database
#This one is to create a user admin for the records database
use records
db.createUser(
  {
    user: "recordsUserAdmin",
    pwd: "password",
    roles: [ { role: "userAdmin", db: "records" } ]
  }
)

#Auth: to pass credential inside mongosh
db.auth("user", "password")

#Conner with compass
mongodb://<user>:<pass>@<remote_ip>:27017/
```



