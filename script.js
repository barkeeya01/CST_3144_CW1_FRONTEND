// mount VUE instance
var app = new Vue({
    el: "#app",
    // data object
    data: {
      showProduct: true,
      lessons: [],
      searchTerm: "",
      sortAttribute: "subject",
      sortOrder: "asc",
      // cart container array
      cart: [],
      // search term to be bounded from model
      //a user must provide “Name” and “Phone number” before can click on the checkout button (1%)
      username: "",
      phonenumber: "",
      backendURL: "https://cst-3145-cw1-backend.onrender.com/",
    },
  
    // after the VUE app is launched, invoke the get the lessons from backend
    created() {
      this.getLessons();
    },
  
    // register any change to the values of search,sortAttribute, sortOrder
    watch: {
      searchTerm: "getLessons",
      sortAttribute: "getLessons",
      sortOrder: "getLessons",
    },
  
    // vue js app methods
    methods: {
      async getLessons() {
        var url = `${this.backendURL}lessons/?search=${this.searchTerm}&sort=${this.sortAttribute}&order=${this.sortOrder}`;
        var lessons = await fetch(url);
        lessons = await lessons.json();
        this.lessons = lessons;
      },
  
      // add to cart method
      addToCart(lesson) {
        // push the product id to cart so as to search product by id and display it in cart page
        // check if lessons spaces is greater than zero
        if (lesson.spaces > 0) {
          // take one from total space
          lesson.spaces--;
          // find current lesson object in cart
          var cartIndex = this.cart.findIndex((i) => i.lesson === lesson);
          // if lesson is already in cart increment amount by 1 so as to prevent duplicates and save space and memory
          if (cartIndex > -1) {
            this.cart[cartIndex].amount++;
          } else {
            // is lesson is not in cart add new lesson object
            this.cart.push({
              lesson: lesson,
              amount: 1,
            });
          }
        }
      },
      removeProduct(lesson) {
        // remove product from cart container array
        const index = this.cart.findIndex((i) => i.lesson === lesson);
        // check for last index
        if (index !== -1) {
          // if lesson space already in cart deduct one amount
          this.cart[index].amount--;
          // add overall space when lesson is removed
          lesson.spaces += 1;
          // else remove all lessons and update to original value
          if (this.cart[index].amount == 0) {
            this.cart.splice(index, 1);
          }
        }
        // when a product is removed from cart add one back to space
      },
      // check for spaces
      // you cannot add a course more the number of space capacity it has.
      checkItemCount(id) {
        itemCount = 0;
        for (i = 0; i < this.cart.length; i++) {
          // check for current instance of is
          if (this.cart[i] === id) {
            itemCount += 1;
          }
        }
        return itemCount;
      },
  
      async checkout() {
        var order = {
          lessons: [...this.cart],
          username: this.username,
          phonenumber: this.phonenumber,
        };
        fetch(`${this.backendURL}orders`, {
          method: "POST",
          headers: { "content-Type": "application/json" },
          body: JSON.stringify(order),
        });
        alert("order successful!");
        this.showProduct = true;
        this.cart = []
        },
      // check if to show checkout page
      showCheckOut() {
        this.showProduct = this.showProduct ? false : true;
      },
    },
    // computed values object
    computed: {
      // get cart length
      cartSize: function () {
        return this.cart.reduce((sum, lesson) => sum + lesson.amount, 0);
      },
      // check if product can be added to cart
      canAddToCart(lessons) {
        return this.lessons.spaces > this.checkItemCount(lessons.id);
      },
      // function to validate phone number and username input field values
      validateUserCredentials() {
        return (
          /^[a-zA-Z]+$/.test(this.username) && /^\d+$/.test(this.phonenumber)
        );
      },
    },
  });
  