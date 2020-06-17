package com.example.resources;

import com.example.api.Data;
import com.example.core.DataRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Path("/")
public class ProjectResource {
    private DataRepository repository;
    public ProjectResource(DataRepository repository) {
        this.repository = repository;
    }
    public static void PublishData(){
        for(int i = 0;i<1;i++){
            Simple s = new Simple(i);
            Thread t = new Thread(s);
            t.start();
        }
    }
    @GET
    @Path("allocation")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Data> allEvents() {
        return repository.findAll();
    }

    @GET
    @Path("allocation/{branch_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public List<Data> branchWise(@PathParam("branch_id") String branch_id){
        return repository.branchWise(branch_id);
    }

    @POST
    @Path("allocation/{case_id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Data addData(@PathParam("case_id") String case_id,Data data) throws IOException {
        String b_id = data.getBranch_id();
        Data x = repository.addData(data, case_id);
        PublishData();
//        if(!x.getBranch_id().equals(b_id)){
//            PublishData(x.getBranch_id());
//        }
        x.setBranch_id(b_id);
        return x;
    }
    }