<template>
  <div class="content">
    <div class="row">
      <div class="col-12">
        <div class="col-lg-4 col-md-6 ml-auto mr-auto">
          <center class="mb-5">
            <h1>
              Payment portal
            </h1>
          </center>
          <div id="smart-button-container">
            <div style="text-align: center">
              <label for="description">Description </label
              ><input
                type="text"
                name="descriptionInput"
                id="description"
                maxlength="127"
                value=""
                class="form-control"
              />
            </div>
            <p
              id="descriptionError"
              style="visibility: hidden; color:red; text-align: center;"
            >
              Please enter a description
            </p>
            <div style="text-align: center">
              <label for="amount">Amount </label
              ><input
                name="amountInput"
                type="number"
                id="amount"
                value=""
                class="form-control"
              /><span> USD</span>
            </div>
            <p
              id="priceLabelError"
              style="visibility: hidden; color:red; text-align: center;"
            >
              Please enter a price
            </p>
            <div id="invoiceidDiv" style="text-align: center; display: none;">
              <label for="invoiceid"> </label
              ><input
                name="invoiceid"
                maxlength="127"
                type="text"
                id="invoiceid"
                value=""
              />
            </div>
            <p
              id="invoiceidError"
              style="visibility: hidden; color:red; text-align: center;"
            >
              Please enter an Invoice ID
            </p>
            <div
              style="text-align: center; margin-top: 0.625rem;"
              id="paypal-button-container"
            ></div>
          </div>
          <!-- <base-input
          label="Amount"
          v-validate="'required'"
          name="Amount"
          value="number"
          v-model="amount"
        >
        </base-input>
        <div ref="paypal"></div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from "@/config";
import { loadScript } from "@paypal/paypal-js";
export default {
  data() {
    return {};
  },
  methods: {
    paypalButton() {
      loadScript({ "client-id": config.PAYPAL_CLIENT_ID_LIVE })
        .then(paypal => {
          var description = document.querySelector(
            "#smart-button-container #description"
          );
          var amount = document.querySelector(
            "#smart-button-container #amount"
          );
          var descriptionError = document.querySelector(
            "#smart-button-container #descriptionError"
          );
          var priceError = document.querySelector(
            "#smart-button-container #priceLabelError"
          );
          var invoiceid = document.querySelector(
            "#smart-button-container #invoiceid"
          );
          var invoiceidError = document.querySelector(
            "#smart-button-container #invoiceidError"
          );
          var invoiceidDiv = document.querySelector(
            "#smart-button-container #invoiceidDiv"
          );

          var elArr = [description, amount];

          if (invoiceidDiv.firstChild.innerHTML.length > 1) {
            invoiceidDiv.style.display = "block";
          }

          var purchase_units = [];
          purchase_units[0] = {};
          purchase_units[0].amount = {};

          function validate(event) {
            return event.value.length > 0;
          }
          paypal
            .Buttons({
              style: {
                color: "gold",
                shape: "rect",
                label: "pay",
                layout: "vertical"
              },

              // onInit: function(data, actions) {
              //   actions.disable();

              //   if (invoiceidDiv.style.display === "block") {
              //     elArr.push(invoiceid);
              //   }

              //   elArr.forEach(function(item) {
              //     item.addEventListener("keyup", function(event) {
              //       var result = elArr.every(validate);
              //       if (result) {
              //         actions.enable();
              //       } else {
              //         actions.disable();
              //       }
              //     });
              //   });
              // },

              onClick: function() {
                if (description.value.length < 1) {
                  descriptionError.style.visibility = "visible";
                } else {
                  descriptionError.style.visibility = "hidden";
                }

                if (amount.value.length < 1) {
                  priceError.style.visibility = "visible";
                } else {
                  priceError.style.visibility = "hidden";
                }

                if (
                  invoiceid.value.length < 1 &&
                  invoiceidDiv.style.display === "block"
                ) {
                  invoiceidError.style.visibility = "visible";
                } else {
                  invoiceidError.style.visibility = "hidden";
                }

                purchase_units[0].description = description.value;
                purchase_units[0].amount.value = amount.value;

                if (invoiceid.value !== "") {
                  purchase_units[0].invoice_id = invoiceid.value;
                }
              },

              createOrder: function(data, actions) {
                return actions.order.create({
                  purchase_units: purchase_units
                });
              },

              onApprove: function(data, actions) {
                return actions.order.capture().then(function(orderData) {
                  // Full available details
                  console.log(
                    "Capture result",
                    orderData,
                    JSON.stringify(orderData, null, 2)
                  );

                  // Show a success message within this page, e.g.
                  const element = document.getElementById(
                    "paypal-button-container"
                  );
                  element.innerHTML = "";
                  element.innerHTML =
                    "<h3>Thank you for your payment! You may refresh this page if you want to make another payment</h3>";
                  amount.value = "";
                  description.value = "";

                  // Or go to another URL:  actions.redirect('thank_you.html');
                });
              },

              onError: function(err) {
                console.log(err);
              }
            })
            .render("#paypal-button-container");
        })
        .catch(error => {
          console.error("failed to load the PayPal JS SDK script", error);
        });
    }
  },
  mounted() {
    this.paypalButton();
  }
};
</script>
