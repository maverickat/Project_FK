package com.example.core;

import java.util.Properties;
import org.apache.kafka.clients.producer.Producer;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerRecord;

public class KafkaPub {
    private static Producer<String, String> producer;
    public static void CreatePub(){
        Properties props = new Properties();
        props.put("bootstrap.servers", "localhost:9092");
        props.put("acks", "all");
                props.put("retries", 0);
        props.put("batch.size", 16384);
        props.put("linger.ms", 1);
        props.put("buffer.memory", 33554432);
        props.put("key.serializer","org.apache.kafka.common.serialization.StringSerializer");
        props.put("value.serializer","org.apache.kafka.common.serialization.StringSerializer");
        producer = new KafkaProducer<String, String>(props);
        //System.out.println("Publisher Created");
    }
    public static void PubData(String branch_id){
        String topicName ="pub_msg";
        producer.send(new ProducerRecord<String, String>(topicName,
                branch_id, branch_id));
    }
}