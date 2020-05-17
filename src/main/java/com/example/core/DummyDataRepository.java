package com.example.core;

import com.example.api.Data;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.type.CollectionType;
import com.google.common.base.Charsets;
import com.google.common.base.MoreObjects;
import com.google.common.io.Resources;
import java.io.IOException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

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
        ClassLoader loader = (ClassLoader) MoreObjects.firstNonNull(Thread.currentThread().getContextClassLoader(), Resources.class.getClassLoader());
        URL url = loader.getResource(DATA_SOURCE);
        String json = Resources.toString(url, Charsets.UTF_8);
        ObjectMapper mapper = new ObjectMapper();
        CollectionType type = mapper
                .getTypeFactory()
                .constructCollectionType(List.class, Data.class);
       alldata = mapper.readValue(json, type);
    }

    @Override
    public List<Data> findAll() {
        return alldata;
    }

    @Override
    public List<Data> branchWise(String branch_id) {
        List<Data> d = new ArrayList<>();
        for(Data i: alldata){
            if(i.getBranch_id().equals(branch_id)){
                d.add(i);
            }
        }
        return d;
    }

    @Override
    public Data addData(Data data,String case_id){
        data.setCase_id(case_id);
        alldata.add(data);
        return data;
    }
}