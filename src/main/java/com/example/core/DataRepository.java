package com.example.core;

import com.example.api.Data;
import java.util.List;

public interface DataRepository {
    public List<Data> findAll();
    public List<Data> branchWise(String id);
    public Data addData(Data data,String case_id);
}