// Task 1
// Create a cart chain event manager in js. The cart chain event manager is to modify Shopify's cart via different kinds of actions. A practical example of this is when the cart’s value is over $100, I want to automatically add a gift product to the cart. And maybe after the gift is added, I want to update the cart’s attribute with the gift’s variant id. These actions are obviously asynchronous, happening one after another. And depending on different stores, there might be different chain events.
// The Cart Chain Event Manager need to have these functions

// addChainEvent({ name: ‘event name’, action: async (cart /* Shopify cart obj*/) => {
//   // ... do something asynchronously here
//   return newCart; // returning null or undefined will stop the chain from continueing
// } })

// startChainEvent(cart /* Shopify cart obj*/) // This ASYNC function trigger the events from the top

// getCart() // returns the Shopify cart

// 	And usage example of this would be:

// cartEventManager.addChainEvent({
//   name: 'CHECK_AND_ADD_GIFT',
//   action: async (cart) => {
//     // script to check the cart and call /cart/add to add the gift, then call /cart.json to return the newCart. Return null if it's not time to add the gift yet
//     return newCart
//   }
// })

// cartEventManager.addChainEvent({
//   name: 'UPDATE_CART_ATTRIBUTE',
//   action: async (cart) => {
//     // call /cart/update.js to update cart attribute and return the newCart
//     return newCart
//   }
// })

// const cart = await fetch('/cart.json').then(res => res.json)
// await cartEventManager.startChainEvent(cart)
// console.log('CHAIN FINISHED');

class CartChainEventManager {
  constructor() {
    this._events = [];
    this._cart = null;
  }

  addChainEvent({ name, action }) {
    this._events.push({ name, action });
  }

  async startChainEvent(cart) {
    this._cart = cart;
    for (const event of this._events) {
      const result = await event.action(this._cart);

      if (!result) {
        console.log(`Chain event ${event.name} stopped the chain`);
        return;
      }

      this._cart = result;
    }
  }

  getCart() {
    return this._cart;
  }
}

// MOCK API CALLS

let mockCart = {
  total_price: 12000,
  items: [],
  attributes: {},
};

async function fetchCart() {
  return JSON.parse(JSON.stringify(mockCart));
}

async function addItem(variantId) {
  mockCart.items.push({
    id: variantId,
    quantity: 1,
    title: "Mock Item",
  });
  // Update total price to simulate adding item
  mockCart.total_price += 1000;
  return JSON.parse(JSON.stringify(mockCart));
}

async function updateCartAttribute(cart, attribute, value) {
  cart.attributes = cart.attributes || {};
  cart.attributes[attribute] = value;
  return cart;
}

// Export the class for use in tests
module.exports = {
  CartChainEventManager,
  fetchCart,
  addItem,
  updateCartAttribute,
};

// TEST SETUP - Run with: node index.js
(async () => {
  console.log("=".repeat(60));
  console.log("CART CHAIN EVENT MANAGER - TEST SETUP");
  console.log("=".repeat(60));
  console.log("");

  // Create a fake initial cart object
  const fakeInitialCart = {
    total_price: 15000, // $150.00 (in cents)
    items: [
      {
        id: 12345,
        variant_id: 12345,
        quantity: 2,
        title: "Test Product",
        price: 5000,
      },
      {
        id: 67890,
        variant_id: 67890,
        quantity: 1,
        title: "Another Product",
        price: 5000,
      },
    ],
    attributes: {},
    currency: "USD",
    item_count: 3,
  };

  console.log("📦 Initial Cart:");
  console.log(JSON.stringify(fakeInitialCart, null, 2));
  console.log("");

  // Create cart event manager instance
  const cartEventManager = new CartChainEventManager();

  // Add chain event: Check and add gift if cart value is over $100
  cartEventManager.addChainEvent({
    name: "CHECK_AND_ADD_GIFT",
    action: async (cart) => {
      console.log(
        `🔍 Checking cart value: $${(cart.total_price / 100).toFixed(2)}`
      );

      // Check if cart total is over $100 (10000 cents)
      if (cart.total_price > 10000) {
        console.log("✅ Cart value exceeds $100 - Adding gift product...");

        const giftVariantId = "GIFT-001";
        const newItem = {
          id: giftVariantId,
          variant_id: giftVariantId,
          quantity: 1,
          title: "Free Gift",
          price: 0,
        };

        // Create a new cart object with the gift added
        const newCart = {
          ...cart,
          items: [...cart.items, newItem],
          total_price: cart.total_price, // Gift is free, so price stays the same
          item_count: cart.item_count + 1,
        };

        console.log(`🎁 Gift added! Variant ID: ${giftVariantId}`);
        return newCart;
      } else {
        console.log("❌ Cart value is below $100 - No gift added");
        return null; // Stop the chain
      }
    },
  });

  // Add chain event: Update cart attribute with gift variant ID
  cartEventManager.addChainEvent({
    name: "UPDATE_CART_ATTRIBUTE",
    action: async (cart) => {
      console.log("📝 Updating cart attributes...");

      // Find the gift item in the cart
      const giftItem = cart.items.find((item) => item.title === "Free Gift");

      if (giftItem) {
        const newCart = {
          ...cart,
          attributes: {
            ...cart.attributes,
            gift_variant_id: giftItem.variant_id,
            gift_added_at: new Date().toISOString(),
          },
        };

        console.log(
          `✅ Cart attribute updated: gift_variant_id = ${giftItem.variant_id}`
        );
        return newCart;
      } else {
        console.log("⚠️  No gift found in cart - Skipping attribute update");
        return cart; // Continue with current cart
      }
    },
  });

  // Start the chain event
  console.log("🚀 Starting chain event...");
  console.log("");

  try {
    await cartEventManager.startChainEvent(fakeInitialCart);
    console.log("");
    console.log("✅ CHAIN FINISHED");
    console.log("");

    // Get and display the final cart
    const finalCart = cartEventManager.getCart();
    console.log("📦 Final Cart:");
    console.log(JSON.stringify(finalCart, null, 2));
    console.log("");
    console.log("=".repeat(60));
  } catch (error) {
    console.error("❌ Error during chain event:", error);
  }
})();
