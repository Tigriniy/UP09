Vue.component('product-details', {
    props: {
        details: {
            type: Array,
            required: true
        }
    },
    template: `
        <ul>
            <li v-for="detail in details">{{ detail }}</li>
        </ul>
    `
})





Vue.component('product', {
    props: {
        premium: {
            type: Boolean,
            required: true
        }
    },
    template: `
    <div class="product">
        <div class="product-image">
            <img v-bind:src="image" v-bind:alt="altText" />
        </div>

        <div class="product-info">
            <h1>{{ title }}</h1>
            <p>{{ sale }}</p>
            <p>{{ description }}</p>
            <a v-bind:href="link">More products like this</a>
            <p v-if="inStock">In stock</p>
            <p v-else v-bind:style="{ textDecoration: 'line-through' }">Out of Stock</p>
            <ul>
                <li v-for="detail in details">{{ detail }}</li>
            </ul>
            <p>Shipping: {{ shipping }}</p>
            <div
                    class="color-box"
                    v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    :style="{ backgroundColor:variant.variantColor }"
                    @mouseover="updateProduct(index)"
            ></div>

            <div v-for="size in sizes">
                <p>{{ size }}</p>
            </div>
            <div class="cart">
                <p>Cart({{ cart }})</p>
            </div>

            <button
                    v-on:click="addToCart"
                    :disabled="!inStock"
                    :class="{ disabledButton: !inStock }"
            >
                Add to cart
            </button>
            <button v-on:click="removeFromCart">Remove from cart</button>
        </div>
    </div>
 `,
    data() {
        return {
            product: "Socks",
            description: "A pair of warm, fuzzy socks.",
            altText: "A pair of socks",
            link: "https://www.amazon.com/s/ref=nb_sb_noss?url=search-alias%3Daps&field-keywords=socks",
            inventory: 100,
            onSale: true,
            selectedVariant: 0,
            brand: 'Vue Mastery',
            details: ['80% cotton', '20% polyester', 'Gender-neutral'],
            variants: [
                {
                    variantId: 2234,
                    variantColor: 'green',
                    variantImage: "./assets/vmSocks-green-onWhite.jpg",
                    variantQuantity: 10
                },
                {
                    variantId: 2235,
                    variantColor: 'blue',
                    variantImage: "./assets/vmSocks-blue-onWhite.jpg",
                    variantQuantity: 0
                }
            ],

            sizes: ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'],
            cart: 0
        }
    },
    methods: {
        addToCart() {
            this.cart += 1
        },
        removeFromCart() {
            if (this.cart > 0) {
                this.cart -= 1
            }
        },
        updateProduct(index) {
            this.selectedVariant = index
        },
    },
    computed: {
        title() {
            return this.brand + ' ' + this.product;
        },

        image() {
            return this.variants[this.selectedVariant].variantImage;
        },
        inStock() {
            return this.variants[this.selectedVariant].variantQuantity > 0
        },
        sale() {
            if (this.onSale) {
                return this.brand + ' ' + this.product + ' сейчас на распродаже!'
            } else {
                return this.brand + ' ' + this.product + ' не на распродаже'
            }
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return 2.99
            }
        }

    }
})

let app = new Vue({
    el: '#app',
    data: {
        premium: true,
    }
})

