package com.example.mobileicp4;

import android.content.Intent;
import android.graphics.Bitmap;
import android.provider.MediaStore;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;

public class Main2Activity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main2);
    }
    public void takePhoto(View v){
        Intent picIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        startActivityForResult(picIntent,100);
    }
    @Override
    protected void onActivityResult(int reqCode, int resultCode, Intent data){
        ImageView iv = findViewById(R.id.imageView);
        if (reqCode == 100 && resultCode == -1){
            Bitmap imageBitmap = (Bitmap) data.getExtras().get("data");
            iv.setImageBitmap(imageBitmap);
        }
    }
}
