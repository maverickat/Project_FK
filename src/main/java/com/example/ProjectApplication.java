package com.example;

import com.example.core.DataRepository;
import com.example.core.DummyDataRepository;
import com.example.resources.ProjectResource;
import io.dropwizard.Application;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;

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
        DataRepository repository = new DummyDataRepository();
        final ProjectResource resource = new ProjectResource(repository);
        environment.jersey().register(resource);
    }

}
