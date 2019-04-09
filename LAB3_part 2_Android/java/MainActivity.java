package com.example.simpleprofilebensolomon;

import android.content.Intent;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

import com.google.android.gms.auth.api.signin.GoogleSignIn;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInClient;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.SignInButton;
import com.google.android.gms.common.api.ApiException;
import com.google.android.gms.tasks.Task;



public class MainActivity extends AppCompatActivity {
    GoogleSignInClient mGoogle;
    int RC_SIGN_IN =  20;
    @Override


    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_main);

        GoogleSignInOptions gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestIdToken(getString(R.string.webClient))
                .requestEmail()
                .build();

        mGoogle = GoogleSignIn.getClient(this, gso);
        //Button googleSignIn = (Button) findViewById(R.id.googleLoginButton);
    }
    public void signIn(View v) {
        Intent signInIntent = mGoogle.getSignInIntent();
        startActivityForResult(signInIntent,RC_SIGN_IN);
    }
    public void login(View v) {
        Intent profilePage = new Intent(MainActivity.this,Main2Activity.class);
        MainActivity.this.startActivity(profilePage);
    }
}
