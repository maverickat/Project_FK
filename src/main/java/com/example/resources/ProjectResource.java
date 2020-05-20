package com.example.resources;

import com.example.api.Data;
import com.example.core.ClientProp;
import com.example.core.DataRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.sse.OutboundSseEvent;
import javax.ws.rs.sse.Sse;
import javax.ws.rs.sse.SseEventSink;
import java.util.*;
import java.util.concurrent.CompletionStage;

@Path("/")
public class ProjectResource {
    private DataRepository repository;
    private Map<String, List<ClientProp>> clients = new HashMap<String, List<ClientProp>>();
    public ProjectResource(DataRepository repository) {
        this.repository = repository;
    }
    private void PublishData(String branch_id){
        if(clients.containsKey(branch_id)){
            Iterator<ClientProp> i = clients.get(branch_id).iterator();
            while(i.hasNext()) {
                ClientProp c = i.next();
                if (c.getSink().isClosed())
                    i.remove();
                else
                    SendEvent(branch_id, c.getSink(), c.getSse());
            }
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
    public Data addData(@PathParam("case_id") String case_id,Data data) throws JsonProcessingException {
        String b_id = data.getBranch_id();
        Data x = repository.addData(data, case_id);
        PublishData(b_id);
        if(!x.getBranch_id().equals(b_id))
        PublishData(x.getBranch_id());
        x.setBranch_id(b_id);
        return x;
    }
    @Path("dashboard/{branch_id}")
    @GET
    @Produces(MediaType.SERVER_SENT_EVENTS)
    public void getServerSentEvents(@PathParam("branch_id") String branch_id,@Context SseEventSink eventSink, @Context Sse sse) {
        new Thread(() -> {
            ClientProp c = new ClientProp(eventSink,sse);
            if(clients.containsKey(branch_id)){
                clients.get(branch_id).add(c);
            }
            else{
                List<ClientProp>  l= new ArrayList<>();
                l.add(c);
                clients.put(branch_id,l);
            }
            final OutboundSseEvent event = sse.newEventBuilder()
                    .comment("SSE Connection Established")
                    .build();
            eventSink.send(event);
        }).start();
    }
    @Produces(MediaType.SERVER_SENT_EVENTS)
    public void SendEvent(String branch_id, SseEventSink eventSink, Sse sse){
        ObjectMapper mapper = new ObjectMapper();
        String msg = null;
        try {
            msg = mapper.writeValueAsString(branchWise(branch_id));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
        }
        final OutboundSseEvent event = sse.newEventBuilder()
                .name("message")
                .data(String.class,msg)
                .build();
        eventSink.send(event);
    }
    }