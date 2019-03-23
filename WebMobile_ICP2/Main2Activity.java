package com.example.vijaya.myorder;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.widget.TextView;

public class Main2Activity extends AppCompatActivity {
    String email;
    String ordersummary;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            setContentView(R.layout.activity_main2);
            Intent intent = getIntent();
            ordersummary = intent.getExtras().getString("ordersummary");
        TextView quantityTextView = (TextView) findViewById(R.id.orderSummaryText);
        quantityTextView.setText(ordersummary);
        email = intent.getExtras().getString("email");


    }

    private void sendEmail(){
        // SEND EMAIL
        Intent emailx = new Intent(Intent.ACTION_SEND_MULTIPLE);
        emailx.setType("text/plain");
        emailx.putExtra(Intent.EXTRA_EMAIL, new String[]{email});
        emailx.putExtra(Intent.EXTRA_SUBJECT, "Your Pizza Order Has Been Received!");
        emailx.putExtra(Intent.EXTRA_TEXT,"Sent From Pizza Buddy\n\n" + ordersummary);
        startActivity(emailx);
    }
}
