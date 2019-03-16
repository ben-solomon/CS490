package com.example.simplelogin;

import android.animation.Animator;
import android.animation.AnimatorListenerAdapter;
import android.annotation.TargetApi;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.support.annotation.NonNull;
import android.support.design.widget.Snackbar;
import android.support.v7.app.AppCompatActivity;
import android.app.LoaderManager.LoaderCallbacks;

import android.content.CursorLoader;
import android.content.Loader;
import android.database.Cursor;
import android.net.Uri;
import android.os.AsyncTask;

import android.os.Build;
import android.os.Bundle;
import android.provider.ContactsContract;
import android.support.v7.widget.Toolbar;
import android.text.TextUtils;
import android.view.KeyEvent;
import android.view.View;
import android.view.View.OnClickListener;
import android.view.inputmethod.EditorInfo;
import android.widget.ArrayAdapter;
import android.widget.AutoCompleteTextView;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.List;

import static android.Manifest.permission.READ_CONTACTS;

/**
 * A login screen that offers login via email/password.
 */
public class LoginActivity extends AppCompatActivity  {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_login);
    }
// method to login
    public void login(View v) {
        // get username textview
        TextView user = (TextView)findViewById(R.id.UserName);
        //pull text string out of textview
        String usertxt = user.getText().toString();
        //get password textview
        TextView pw = (TextView)findViewById(R.id.Password);
        //pull string out of textview
        String pwtext = pw.getText().toString();

        // do whatever validation is needed with username and password
        if (usertxt.equals("Ben") & pwtext.equals("1234")){
            // go to main homescreen
            Intent myIntent = new Intent(LoginActivity.this,MainActivity.class);
            LoginActivity.this.startActivity(myIntent);
        }else {
            // popup notifying of invalid login
            Toast.makeText(getApplicationContext(), "Invalid Username or Password!!", Toast.LENGTH_SHORT).show();
        }


    }
}

