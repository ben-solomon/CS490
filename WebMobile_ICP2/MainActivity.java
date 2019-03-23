package com.example.vijaya.myorder;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.View;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends AppCompatActivity {
    private static final String MAIN_ACTIVITY_TAG = "MainActivity";
    final int PIZZA_PRICE = 5;
    final int PEPPERONI_PRICE = 2;
    final int MUSHROOMS_PRICE = 1;
    int quantity = 1;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    /**
     * This method is called when the order button is clicked.
     */

    public void submitOrder(View view) {

        // get user input
        EditText userInputNameView = (EditText) findViewById(R.id.user_input);
        String userInputName = userInputNameView.getText().toString();

        // check if red and or white sauce is selected
        CheckBox RedSauce = (CheckBox) findViewById(R.id.redsauce_checked);
        boolean hasRedSauce = RedSauce.isChecked();

        CheckBox WhiteSauce = (CheckBox) findViewById(R.id.whitesauce_checked);
        boolean hasWhiteSauce = WhiteSauce.isChecked();

        //check if mushroom or pepperoni wanted
        CheckBox Pepperoni = (CheckBox) findViewById(R.id.pepperoni_checked);
        boolean hasPepperoni = Pepperoni.isChecked();

        // check if mushrooms is selected
        CheckBox Mushrooms = (CheckBox) findViewById(R.id.mushrooms_checked);
        boolean hasMushrooms = Mushrooms.isChecked();

        // calculate and store the total price
        int basePrice = PIZZA_PRICE;
        if (hasPepperoni) {
            basePrice += PEPPERONI_PRICE;
        }
        if (hasMushrooms) {
            basePrice += MUSHROOMS_PRICE;
        }
        float totalPrice = quantity * basePrice;

        // create and store the order summary
        String ordertext = "Thank you for your order\n" + userInputName + "\n Your order summary is below\n\n";
        if (hasRedSauce & hasWhiteSauce) {
            ordertext += "Sauce: Pink Sauce\n";
        }
        else if (hasRedSauce){
            ordertext += "Sauce: Red Sauce\n";
        }
        else if (hasWhiteSauce){
            ordertext += "Sauce: White Sauce\n";
        }
        else{
            ordertext += "Sauce: No Sauce\n";
        }

        if (hasPepperoni)

    {
        ordertext += "Add Pepperoni (+$2.00)\n";
    }
    if(hasMushrooms) {
        ordertext += "Add Mushrooms (+$1.00)\n";
            }
            ordertext += "qty: " + quantity;
            ordertext += "\norder total: $"+ totalPrice + "0";






        //Go to order summary page

        Intent i = new Intent(this, Main2Activity.class);
        i.putExtra("ordersummary", ordertext);
        i.putExtra("email", userInputName);
        startActivity(i);
    }

    /**
     * This method displays the given quantity value on the screen.
     */
    private void display(int number) {
        TextView quantityTextView = (TextView) findViewById(R.id.quantity_text_view);
        quantityTextView.setText("" + number);
    }

    /**
     * This method increments the quantity of coffee cups by one
     *
     * @param view on passes the view that we are working with to the method
     */

    public void increment(View view) {
        if (quantity < 100) {
            quantity = quantity + 1;
            display(quantity);
        } else {
            Log.i("MainActivity", "Please select less than one hundred cups of coffee");
            Context context = getApplicationContext();
            String lowerLimitToast = getString(R.string.too_much_coffee);
            int duration = Toast.LENGTH_SHORT;
            Toast toast = Toast.makeText(context, lowerLimitToast, duration);
            toast.show();
            return;
        }
    }

    /**
     * This method decrements the quantity of coffee cups by one
     *
     * @param view passes on the view that we are working with to the method
     */
    public void decrement(View view) {
        if (quantity > 1) {
            quantity = quantity - 1;
            display(quantity);
        } else {
            Log.i("MainActivity", "Please select atleast one cup of coffee");
            Context context = getApplicationContext();
            String upperLimitToast = getString(R.string.too_little_coffee);
            int duration = Toast.LENGTH_SHORT;
            Toast toast = Toast.makeText(context, upperLimitToast, duration);
            toast.show();
            return;
        }
    }
}