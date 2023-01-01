
FROM openjdk:11
COPY dsl-service-0.0.1-SNAPSHOT.jar dsl-service-0.0.1-SNAPSHOT.jar
COPY application.properties application.properties
RUN mkdir -p /admin/log

ENTRYPOINT ["java","-jar","/dsl-service-0.0.1-SNAPSHOT.jar","--spring.config.location=application.properties"]
