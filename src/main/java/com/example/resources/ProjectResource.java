package com.example.resources;

import com.example.api.Data;
import com.example.core.ClientProp;
import com.example.core.DataRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;

@Path("/")
public class ProjectResource {
    private DataRepository repository;
    private Map<String,String> branch_user = new HashMap<>();
    public ProjectResource(DataRepository repository) {
        this.repository = repository;
        branch_user.put("branch1","user1");
        branch_user.put("branch2","user2");
        branch_user.put("branch3","user3");
    }

    public void PublishData(String branch_id) throws IOException {

        ObjectMapper mapper = new ObjectMapper();
        String msg = null;
        try {
            msg = mapper.writeValueAsString(branchWise(branch_id));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        String NodeJsUrl = "http://127.0.0.1:3001/dashboard/" + branch_user.get(branch_id);
        URL url = new URL(NodeJsUrl);
        HttpURLConnection con = (HttpURLConnection)url.openConnection();
        con.setRequestMethod("POST");
        con.setRequestProperty("Content-Type", "application/json");
        con.setRequestProperty("Accept", "application/json");
        con.setDoOutput(true);
        con.setDoInput (true);
        DataOutputStream output = new DataOutputStream(con.getOutputStream());
        output.writeBytes(msg);
        output.flush();
        output.close();
        try(BufferedReader br = new BufferedReader(
                new InputStreamReader(con.getInputStream(), "utf-8"))) {
            StringBuilder response = new StringBuilder();
            String responseLine = null;
            while ((responseLine = br.readLine()) != null) {
                response.append(responseLine.trim());
            }
            System.out.println(response.toString());
            con.disconnect();
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
        PublishData(b_id);
        if(!x.getBranch_id().equals(b_id)){
            PublishData(x.getBranch_id());
        }
        x.setBranch_id(b_id);
        return x;
    }
    }