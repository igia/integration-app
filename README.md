# Integration Application

Integration Application allows System Administrators to configure data integration pipelines for healthcare data via a user interface. Healthcare systems (e.g. EHR) can route, filter, and transform data over different protocols (e.g. MLLP, SFTP, HTTP, FILE.). It can provide integration for heterogeneous, high volume and/or time sensitive data following established integration patterns.

Apache camel is used to support above functionality. Following properties are supported currently: 

### HTTP
* Consumer  
  enableCORS, sessionSupport, bridgeErrorHandler, httpMethodRestrict,sendServerVersion, handlers
  
  For more details please check the camel document for [Jetty]

* Producer  
  connectTimeout, socketTimeout, httpMethod, authMethod, authPassword, authUsername, maxTotalConnections, connectionsPerRoute, bridgeEndpoint, copyHeaders
  
  For more details please check the camel document for [HTTP]

### MLLP
* Consumer  
  idleTimeout, requireEndOfData, validatePayload, backlog

* Producer  
  connectTimeout
  
  For more details please check the camel document for [MLLP]
  
### FILE 
* Consumer  
  fileName, doneFileName , moveFailed, move, sortBy, recursive, antInclude, antExclude, delay, initialDelay, scheduler.cron, charset, bridgeErrorHandler , preSort, startingDirectoryMustExist, directoryMustExist, autoCreate ,runLoggingLevel 

* Producer  
  fileName, doneFileName ,flatten, charset, autoCreate
  
  For more details please check the camel document for [FILE]
  
### SFTP
* Consumer  
  fileName, doneFileName , moveFailed, move, sortBy, recursive, antInclude, antExclude, delay, initialDelay, scheduler.cron, charset, bridgeErrorHandler , preSort, startingDirectoryMustExist, directoryMustExist, autoCreate ,runLoggingLevel, reconnectDelay 

* Producer  
  fileName, doneFileName ,flatten, charset, autoCreate, reconnectDelay 
  
  For more details please check the camel document for [SFTP]

## Usage
This application was generated using JHipster 5.4.2, you can find documentation and help at [https://www.jhipster.tech/documentation-archive/v5.4.2](https://www.jhipster.tech/documentation-archive/v5.4.2).

This is a "gateway" application intended to be part of a microservice architecture, please refer to the [Doing microservices with JHipster][] page of the documentation for more information.

This application is configured for Service Discovery and Configuration with the JHipster-Registry. On launch, it will refuse to start if it is not able to connect to the JHipster-Registry at [http://localhost:8761](http://localhost:8761). For more information, read our documentation on [Service Discovery and Configuration with the JHipster-Registry][].

### Prerequisites

#### Software
Following software installations should be done on developer machine:

- [Node.js][]: We use Node to run a development web server and build the project.
   Depending on your system, you can install Node either from source or as a pre-packaged bundle. Please refer to pom.xml for Node.js version.

- [Yarn][]: We use Yarn to manage Node dependencies.
   Depending on your system, you can install Yarn either from source or as a pre-packaged bundle. Please refer to pom.xml for Yarn version.

#### Services
Following services should be started as prerequisite to the Integration Application:

- Jhipster Registry

    ```
    docker-compose -f src/main/docker/jhipster-registry.yml up
    ```
- Keycloak
    
    ```
    docker-compose -f src/main/docker/keycloak.yml up
    ```
- Postgres (only required in production profile)

    ```
    docker-compose -f src/main/docker/postgresql.yml up
    ```
- Configuration Service
  
  Please refer to integration-configuration project documentation to start the configuration service.

- Worker Service

  Please refer to integration-worker project documentation to start the integration worker service.

### Configuration

The security settings in `src/main/resources/application.yml` are configured for above keycloak image.

```yaml
security:
    basic:
        enabled: false
    oauth2:
        client:
            accessTokenUri: http://localhost:9080/auth/realms/igia/protocol/openid-connect/token
            userAuthorizationUri: http://localhost:9080/auth/realms/igia/protocol/openid-connect/auth
            clientId: web_app
            clientSecret: web_app
            scope: openid profile email
        resource:
            userInfoUri: http://localhost:9080/auth/realms/igia/protocol/openid-connect/userinfo
```


## Development

After installing Node, you should be able to run the following command to install development tools.
You will only need to run this command when dependencies change in [package.json](https://github.com/igia/integration-app/blob/master/package.json).

    yarn install

We use yarn scripts and [Webpack][] as our build system.

Run the following commands in two separate terminals to create a blissful development experience where your browser
auto-refreshes when files change on your hard drive.

    ./mvnw
    yarn start

Yarn is also used to manage CSS and JavaScript dependencies used in this application. You can upgrade dependencies by
specifying a newer version in [package.json](https://github.com/igia/integration-app/blob/master/package.json). You can also run `yarn update` and `yarn install` to manage dependencies.
Add the `help` flag on any command to see how you can use it. For example, `yarn help update`.

The `yarn run` command will list all of the scripts available to run for this project.


### Service workers

Service workers are commented by default, to enable them please uncomment the following code.

* The service worker registering script in index.html

```html
 <script>
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', function() {
            navigator.serviceWorker.register('/service-worker.js')
                .then(function () {
                    console.log('Service Worker Registered');
                });
        });
    }
</script>
```

Note: workbox creates the respective service worker and dynamically generate the `service-worker.js`

### Managing dependencies

For example, to add [Leaflet][] library as a runtime dependency of your application, you would run following command:

    yarn add --exact leaflet

To benefit from TypeScript type definitions from [DefinitelyTyped][] repository in development, you would run following command:

    yarn add --dev --exact @types/leaflet

Then you would import the JS and CSS files specified in library's installation instructions so that [Webpack][] knows about them:
Edit `src/main/webapp/app/vendor.ts` file:
~~~
import 'leaflet/dist/leaflet.js';
~~~

Edit `src/main/webapp/content/scss/vendor.scss` file:
~~~
@import '~leaflet/dist/leaflet.css';
~~~
Note: there are still few other things remaining to do for Leaflet that we won't detail here.

For further instructions on how to develop with JHipster, have a look at [Using JHipster in development][].

### Using angular-cli

You can also use [Angular CLI][] to generate some custom client code.

For example, the following command:

    ng generate component my-component

will generate few files:

    create src/main/webapp/app/my-component/my-component.component.html
    create src/main/webapp/app/my-component/my-component.component.ts
    update src/main/webapp/app/app.module.ts


### Standalone Development

During backend development, you can disable cross cutting concerns (discovery, security, cors etc), with an add-on standalone profile. Simply run:

    ./mvnw -Pdev,standalone

To start frontend in standalone mode, use following script:

    yarn start:standalone

## Building for production

To optimize the integrationapp application for production, run:

    ./mvnw -Pprod clean package

This will concatenate and minify the client CSS and JavaScript files. It will also modify `index.html` so it references these new files.
To ensure everything worked, run:

    java -jar target/*.war

Then navigate to [http://localhost:8052](http://localhost:8052) in your browser.

Refer to [Using JHipster in production][] for more details.

## Testing

To launch your application's tests, run:

    ./mvnw clean test

### Client tests

Unit tests are run by [Jest][] and written with [Jasmine][]. They're located in `src/test/javascript/` and can be run with:

    yarn test

UI end-to-end tests are powered by [Protractor][], which is built on top of WebDriverJS. They're located in `src/test/javascript/e2e`
and can be run by starting Spring Boot in one terminal (`./mvnw spring-boot:run`) and running the tests (`yarn e2e`) in a second one.


Before running the UI end-to-end test cases make sure below changes are done.
#### File to File Data Pipeline
When you are running the tests on Linux/Windows, make sure below folder is present/created on system/container where worker service is running
mnt/igia;

#### Sftp to File Data Pipeline
protractor.conf.js is updated with below param values for SFTP endpoint,
sftp_host, sftp_username and sftp_password.

For more information, refer to the [Running tests page][].

## Contributing

Please read [CONTRIBUTING](https://igia.github.io/docs/contributing/) for details on our code of conduct, and the process for submitting pull requests to us.

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/igia/integration-app/tags).

## Acknowledgments
* [JHipster][JHipster Homepage and latest documentation]

## License and Copyright

MPL 2.0 w/ HD  
See [LICENSE](LICENSE) file.  
See [HEALTHCARE DISCLAIMER](HD.md) file.  
© [Persistent Systems, Inc.](https://www.persistent.com)


[JHipster Homepage and latest documentation]: https://www.jhipster.tech
[JHipster 5.4.2 archive]: https://www.jhipster.tech/documentation-archive/v5.4.2
[Doing microservices with JHipster]: https://www.jhipster.tech/documentation-archive/v5.4.2/microservices-architecture/
[Using JHipster in development]: https://www.jhipster.tech/documentation-archive/v5.4.2/development/
[Service Discovery and Configuration with the JHipster-Registry]: https://www.jhipster.tech/documentation-archive/v5.4.2/microservices-architecture/#jhipster-registry
[Using JHipster in production]: https://www.jhipster.tech/documentation-archive/v5.4.2/production/
[Running tests page]: https://www.jhipster.tech/documentation-archive/v5.4.2/running-tests/
[HTTP]: https://github.com/apache/camel/blob/master/components/camel-http4/src/main/docs/http4-component.adoc
[Jetty]: https://github.com/apache/camel/blob/master/components/camel-jetty/src/main/docs/jetty-component.adoc
[FILE]: https://github.com/apache/camel/blob/master/components/camel-file/src/main/docs/file-component.adoc
[SFTP]: https://github.com/apache/camel/blob/master/components/camel-ftp/src/main/docs/sftp-component.adoc
[MLLP]: https://github.com/apache/camel/blob/master/components/camel-mllp/src/main/docs/mllp-component.adoc


[Node.js]: https://nodejs.org/
[Yarn]: https://yarnpkg.org/
[Webpack]: https://webpack.github.io/
[Angular CLI]: https://cli.angular.io/
[BrowserSync]: http://www.browsersync.io/
[Jest]: https://facebook.github.io/jest/
[Jasmine]: http://jasmine.github.io/2.0/introduction.html
[Protractor]: https://angular.github.io/protractor/
[Leaflet]: http://leafletjs.com/
[DefinitelyTyped]: http://definitelytyped.org/

