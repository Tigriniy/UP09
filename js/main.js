let eventBus = new Vue()

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

Vue.component('product-review', {
    template: `
        <div class="review-container">
            <form class="review-form" @submit.prevent="onSubmit">
                <p v-if="errors.length">
                    <b>Please correct the following error(s):</b>
                    <ul>
                        <li v-for="error in errors">{{ error }}</li>
                    </ul>
                </p>

                <p>
                    <label for="name">Name:</label>
                    <input id="name" v-model="name" placeholder="name" required>
                </p>

                <p>
                    <label for="review">Review:</label>
                    <textarea id="review" v-model="review" required></textarea>
                </p>

                <p>
                    <label for="rating">Rating:</label>
                    <select id="rating" v-model.number="rating" required>
                        <option disabled value="">Select rating</option>
                        <option value="5">5</option>
                        <option value="4">4</option>
                        <option value="3">3</option>
                        <option value="2">2</option>
                        <option value="1">1</option>
                    </select>
                </p>

                <p>
                    <label>Would you recommend this product?</label><br>
                    <label>
                        <input type="radio" v-model="recommend" value="yes">
                        Yes
                    </label>
                    <label>
                        <input type="radio" v-model="recommend" value="no">
                        No
                    </label>
                </p>

                <p>
                    <input type="submit" value="Submit">
                </p>
            </form>
        </div>
    `,
    data() {
        return {
            name: '',
            review: '',
            rating: null,
            recommend: '',
            errors: []
        }
    },
    methods: {
        onSubmit() {
            this.errors = [];

            if (!this.name) this.errors.push("Name required.");
            if (!this.review) this.errors.push("Review required.");
            if (!this.rating) this.errors.push("Rating required.");
            if (!this.recommend) this.errors.push("Recommendation required.");

            if (this.errors.length === 0) {
                let productReview = {
                    name: this.name,
                    review: this.review,
                    rating: Number(this.rating),
                    recommend: this.recommend
                };

                eventBus.$emit('review-submitted', productReview);

                this.name = '';
                this.review = '';
                this.rating = null;
                this.recommend = '';
            }
        }
    }
})

Vue.component('product-tabs', {
    props: {
        reviews: {
            type: Array,
            required: false
        },
        shipping: {
            type: String,
            required: true
        },
        details: {
            type: Array,
            required: true
        }
    },
    template: `
        <div class="tabs">
            <ul>
                <span 
                    class="tab"
                    :class="{ activeTab: selectedTab === tab }"
                    v-for="(tab, index) in tabs"
                    :key="index"
                    @click="selectedTab = tab"
                >{{ tab }}</span>
            </ul>
            
            <div v-show="selectedTab === 'Reviews'">
                <p v-if="!reviews.length">There are no reviews yet.</p>
                <ul>
                    <li v-for="(review, index) in reviews" :key="index">
                        <p><strong>{{ review.name }}</strong></p>
                        <p>Rating: {{ review.rating }}/5</p>
                        <p>{{ review.review }}</p>
                        <p>Would recommend: {{ review.recommend }}</p>
                    </li>
                </ul>
            </div>
            
            <div v-show="selectedTab === 'Make a Review'">
                <product-review></product-review>
            </div>
            
            <div v-show="selectedTab === 'Shipping'">
                <p>Shipping: {{ shipping }}</p>
            </div>
            
            <div v-show="selectedTab === 'Details'">
                <product-details :details="details"></product-details>
            </div>
        </div>
    `,
    data() {
        return {
            tabs: ['Reviews', 'Make a Review', 'Shipping', 'Details'],
            selectedTab: 'Reviews'
        }
    }
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
                <img :src="image" :alt="altText" />
            </div>
        
            <div class="product-info">
                <h1>{{ title }}</h1>
                <p>{{ sale }}</p>
                <p>{{ description }}</p>
                <a :href="link">More products like this</a>
                
                <p v-if="inStock">In stock</p>
                <p v-else v-bind:style="{ textDecoration: 'line-through' }">Out of Stock</p>
                
                <div class="price-info">
                    <p v-if="discount > 0" class="original-price">
                        Original price: {{ formattedOriginalPrice }}
                    </p>
                    <p class="current-price">
                        <strong>Price: {{ formattedPriceWithDiscount }}</strong>
                    </p>
                    <p v-if="discount > 0" class="discount">
                        <strong>Discount: {{ discount }}% OFF!</strong>
                    </p>
                </div>
                
                <div class="rating">
                    <p v-if="averageRating > 0">
                        <strong>Average Rating: {{ formattedAverageRating }}/5</strong>
                        ({{ reviews.length }} reviews)
                    </p>
                    <p v-else>No ratings yet</p>
                </div>
                
                <div
                    class="color-box"
                    v-for="(variant, index) in variants"
                    :key="variant.variantId"
                    :style="{ backgroundColor: variant.variantColor }"
                    @mouseover="updateProduct(index)"
                ></div>
        
                <div v-for="size in sizes" :key="size">
                    <p>{{ size }}</p>
                </div>
                
                <button
                    v-on:click="addToCart"
                    :disabled="!inStock"
                    :class="{ disabledButton: !inStock }"
                >
                    Add to cart
                </button>
                <button v-on:click="removeFromCart">Remove</button>
                
                <product-tabs 
                    :reviews="reviews" 
                    :shipping="shipping"
                    :details="details"
                ></product-tabs>
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
            reviews: [],
            price: 19.99,
            discount: 25
        }
    },
    methods: {
        addToCart() {
            this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId);
        },
        removeFromCart() {
            this.$emit('remove-from-cart', this.variants[this.selectedVariant].variantId);
        },
        updateProduct(index) {
            this.selectedVariant = index
        }
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
        priceWithDiscount() {
            if (this.discount > 0) {
                return this.price * (1 - this.discount / 100);
            }
            return this.price;
        },
        originalPrice() {
            return this.price;
        },
        averageRating() {
            if (this.reviews.length === 0) {
                return 0;
            }

            const totalRating = this.reviews.reduce((sum, review) => {
                return sum + review.rating;
            }, 0);
            return totalRating / this.reviews.length;
        },
        shipping() {
            if (this.premium) {
                return "Free";
            } else {
                return "2.99";
            }
        },
        formattedOriginalPrice() {
            return this.originalPrice.toFixed(2);
        },
        formattedPriceWithDiscount() {
            return this.priceWithDiscount.toFixed(2);
        },
        formattedAverageRating() {
            return this.averageRating.toFixed(1);
        }
    },
    mounted() {
        eventBus.$on('review-submitted', productReview => {
            this.reviews.push(productReview)
        })
    }
})

let app = new Vue({
    el: '#app',
    data: {
    premium: true,
        cart: []
},
methods: {
    updateCart(id) {
        this.cart.push(id);
    },
    removeFromCart(id) {
        const index = this.cart.indexOf(id);
        if (index !== -1) {
            this.cart.splice(index, 1);
        }
    }
}
})