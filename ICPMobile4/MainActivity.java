package com.example.mobileicp4;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;

public class MainActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }
    public void mapActivity(View v){
        Intent intent = new Intent(getApplicationContext(),MapsActivity.class);
        startActivity(intent);
    }
    public void cameraActivity(View v) {
        Intent intent = new Intent(getApplicationContext(), Main2Activity.class);
        startActivity(intent);
    }
}
