package com.example.simpleprofilebensolomon;

import android.content.Intent;
import android.net.Uri;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;

public class Main2Activity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main2);
        ImageView email = (ImageView) findViewById(R.id.emailimg);
        ImageView fb = (ImageView) findViewById(R.id.fbimg);
        ImageView twt = (ImageView) findViewById(R.id.twtimg);
        email.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                email();
            }
        });
        fb.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                facebook();
            }
        });
        twt.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                twitter();
            }
        });

    }
    public void logout(View v){
        Intent loginPage = new Intent(Main2Activity.this,MainActivity.class);
        Main2Activity.this.startActivity(loginPage);
    }
    public void email(){

        Intent emailx = new Intent(Intent.ACTION_SEND_MULTIPLE);
        emailx.setType("text/plain");
        emailx.putExtra(Intent.EXTRA_EMAIL, new String[]{"bsbs93@gmail.com"});
        emailx.putExtra(Intent.EXTRA_SUBJECT, "Hey Whats up?");
        startActivity(emailx);
    }
    public void facebook(){
    Intent j = new Intent(Intent.ACTION_VIEW, Uri.parse("https://www.facebook.com/Elmo/"));
    startActivity(j);
    }
    public  void twitter(){
        Intent j = new Intent(Intent.ACTION_VIEW, Uri.parse("https://twitter.com/realDonaldTrump?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor"));
        startActivity(j);
    }

    }


