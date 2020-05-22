package com.example;

import com.example.core.DataRepository;
import com.example.core.DummyDataRepository;
import com.example.core.KafkaPub;
import com.example.core.KafkaSub;
import com.example.resources.ProjectResource;
import io.dropwizard.Application;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;
import org.eclipse.jetty.servlets.CrossOriginFilter;
import javax.servlet.DispatcherType;
import javax.servlet.FilterRegistration;
import java.util.EnumSet;

public class ProjectApplication extends Application<ProjectConfiguration> {
    public static void main(final String[] args) throws Exception {
        new ProjectApplication().run(args);
    }

    @Override
    public String getName() {
        return "Project";
    }

    @Override
    public void initialize(final Bootstrap<ProjectConfiguration> bootstrap) {
        // TODO: application initialization
    }

    @Override
    public void run(final ProjectConfiguration configuration,
                    final Environment environment) {
        //for kafka Publisher ... comment if not using
        KafkaPub.CreatePub();

        final FilterRegistration.Dynamic cors = environment.servlets().addFilter("CORS", CrossOriginFilter.class);
        cors.setInitParameter("allowedOrigins", "*");
        cors.setInitParameter("allowedHeaders", "X-Requested-With,Content-Type,Accept,Origin");
        cors.setInitParameter("allowedMethods", "OPTIONS,GET,PUT,POST,DELETE,HEAD");
        cors.addMappingForUrlPatterns(EnumSet.allOf(DispatcherType.class), true, "/*");
        cors.setInitParameter(CrossOriginFilter.CHAIN_PREFLIGHT_PARAM, Boolean.FALSE.toString());
        cors.setInitParameter("allowedHeaders", "Cache-Control,If-Modified-Since,Pragma,Content-Type,Authorization,X-Requested-With,Content-Length,Accept,Origin");

        DataRepository repository = new DummyDataRepository();
        final ProjectResource resource = new ProjectResource(repository);
        environment.jersey().register(resource);
        //for kafka Subscriber ... comment if not using
        new Thread(()->{
            KafkaSub.KafaSub(resource);
        }).start();
    }

}
