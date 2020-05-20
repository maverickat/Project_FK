package com.example.core;

import javax.ws.rs.sse.Sse;
import javax.ws.rs.sse.SseEventSink;

public class ClientProp {
    private SseEventSink eventSink;
    private Sse sse;
    public ClientProp(SseEventSink eventSink,Sse sse){
        this.eventSink =eventSink;
        this.sse = sse;
    }
    public SseEventSink getSink(){
        return  eventSink;
    }
    public Sse getSse(){
        return  sse;
    }
}
