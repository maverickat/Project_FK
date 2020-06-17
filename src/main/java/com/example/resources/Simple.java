package com.example.resources;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

public class Simple implements Runnable {
    int branch_id;

    Simple(int b ) {
        this.branch_id = b;
    }

    @Override
    public void run() {
        ObjectMapper mapper = new ObjectMapper();
        String msg = null;
        int b = branch_id;
        for (int j = 0; j < 10; j++) {
            b = j;
            for (int i = 0; i < 100; i++) {
                try {
                    Map<String, Long> m = new HashMap<>();
                    m.put("Date", System.currentTimeMillis());
                    msg = mapper.writeValueAsString(m);
                } catch (JsonProcessingException e) {
                    e.printStackTrace();
                }
                HttpRequest request = (HttpRequest) HttpRequest.newBuilder()
                        .uri(URI.create("http://127.0.0.1:3001/dashboard/user" + (b * 100 + i)))
                        .timeout(Duration.ofSeconds(5))
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(msg))
                        .build();
                HttpClient client = HttpClient.newBuilder()
                        .version(HttpClient.Version.HTTP_1_1)
                        .followRedirects(HttpClient.Redirect.NORMAL)
                        .connectTimeout(Duration.ofSeconds(5))
                        .build();
                try {
                    client.send(request, HttpResponse.BodyHandlers.ofString());
                } catch (IOException e) {
                    e.printStackTrace();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
