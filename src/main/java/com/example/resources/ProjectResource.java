package com.example.resources;

import com.example.api.Data;
import com.example.core.DataRepository;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.util.List;

@Path("/allocation")
@Produces(MediaType.APPLICATION_JSON)
public class ProjectResource {
    private DataRepository repository;

    public ProjectResource(DataRepository repository) {
        this.repository = repository;
    }

    @GET
    public List<Data> allEvents() {
        return repository.findAll();
    }

    @GET
    @Path("{branch_id}")
    public List<Data> branchWise(@PathParam("branch_id") String branch_id){
        return repository.branchWise(branch_id);
    }

    @POST
    @Path("{case_id}")
    public Data addData(@PathParam("case_id") String case_id,Data data){
        return repository.addData(data,case_id);
    }
}
