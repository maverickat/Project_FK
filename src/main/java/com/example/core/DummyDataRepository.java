package com.example.core;

import com.example.api.Data;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class DummyDataRepository implements DataRepository{
    private static final String DATA_SOURCE = "data.json";
    private List<Data> alldata;
    public DummyDataRepository() {
        try {
            initData();
        } catch (IOException e) {
            throw new RuntimeException(
                    DATA_SOURCE + " missing or is unreadable", e);
        }
    }

    private void initData() throws IOException {
//        ClassLoader loader = (ClassLoader) MoreObjects.firstNonNull(Thread.currentThread().getContextClassLoader(), Resources.class.getClassLoader());
//        URL url = loader.getResource(DATA_SOURCE);
//        String json = Resources.toString(url, Charsets.UTF_8);
        String data = "";
        try {
            File myObj = new File("src/main/resources/data.json");
            Scanner myReader = new Scanner(myObj);
            while (myReader.hasNextLine()) {
                data = data + myReader.nextLine();
            }
            myReader.close();
        } catch (FileNotFoundException e) {
            System.out.println("An error occurred.");
            e.printStackTrace();
        }
        ObjectMapper mapper = new ObjectMapper();
        CollectionType type = mapper
                .getTypeFactory()
                .constructCollectionType(List.class, Data.class);
       alldata = mapper.readValue(data, type);
    }
    private void writeData(List<Data> alldata) throws IOException{
        ObjectMapper mapper = new ObjectMapper();
        CollectionType type = mapper
                .getTypeFactory()
                .constructCollectionType(List.class, Data.class);
        mapper.writeValue(new File("src/main/resources/data.json"), alldata);
    }
    @Override
    public List<Data> findAll() {
            try {
                initData();
            } catch (IOException e) {
                e.printStackTrace();
            }
        return alldata;
    }

    @Override
    public List<Data> branchWise(String branch_id) {
        List<Data> d = new ArrayList<>();
        try {
            initData();
        } catch (IOException e) {
            e.printStackTrace();
        }
        for(Data i: alldata){
            if(i.getBranch_id().equals(branch_id)){
                d.add(i);
            }
        }
        return d;
    }

    @Override
    public Data addData(Data data,String case_id){
        boolean f = true;
        data.setCase_id(case_id);
        String s = data.getBranch_id();
        try {
            initData();
        } catch (IOException e) {
            e.printStackTrace();
        }
        for(Data i: alldata){
            if(i.getCase_id().equals(case_id)){
                s = i.getBranch_id();
                i.setBranch_id(data.getBranch_id());
                i.setTechnician_id(data.getTechnician_id());
                f=false;
                break;
            }
        }
        if(f)
        alldata.add(data);
        data.setBranch_id(s);
        try {
            writeData(alldata);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return data;
    }
}