package com.example.api;

import com.fasterxml.jackson.annotation.JsonProperty;

public class Data {
    private String branch_id;
    private String case_id ;
    private String technician_id;
    public Data(){
        //for deserialize by jackson
    }
    public Data(String branch_id,String case_id,String technician_id){
        this.branch_id =branch_id;
        this.case_id = case_id;
        this.technician_id=technician_id;
    }
    @JsonProperty
    public String getBranch_id(){
        return branch_id;
    }
    @JsonProperty
    public String getCase_id(){
        return case_id;
    }
    @JsonProperty
    public String getTechnician_id(){
        return technician_id;
    }
    @JsonProperty
    public void setCase_id(String case_id){
        this.case_id = case_id;
    }
    @JsonProperty
    public void setBranch_id(String branch_id){
        this.branch_id = branch_id;
    }
    @JsonProperty
    public void setTechnician_id(String technician_id){
        this.technician_id = technician_id;
    }
}
