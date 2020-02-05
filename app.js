const cartBtn = document.querySelector(".cart-btn")
const closeCartBtn = document.querySelector(".close-cart")
const clearCart = document.querySelector(".clear-cart")
const cartDOM = document.querySelector(".cart")
const cartOverlay = document.querySelector(".cart-overlay")
const cartContent = document.querySelector(".cart-content")
const productsDOM = document.querySelector(".products-center")
const cartItems = document.querySelector(".cart-items")
const cartTotal = document.querySelector(".cart-total")


let cart = []
let buttonsDOM = []

//fetch products
class Products {

    async getProducts(){
        try{
            let result = await fetch("./products.json")
            let data = await result.json()

            let products = data.items
            products = products.map(function(item){
                const {title,price} = item.fields
                const {id} = item.sys
                const image = item.fields.image.fields.file.url
                return {title,price,id,image}
            })
            return products
        }catch (error){
            console.log(error)
        }
    }
}


// ui manipulation
class UI {

    displayProducts(products){
        let result = ""
        products.forEach(function (product) {
            result += 
            `
            <article class="product">
                <div class="img-container">
                    <img src=${product.image} alt="product" class="product-img">
                    <button type="button" class="bag-btn" data-id=${product.id}>Add to cart</button>
                </div>
                <h3>${product.title}</h3>
                <h4>${product.price}$</h4>
            </article>
            `
        });
        productsDOM.innerHTML = result
    }

    getBagButtons(){
        const buttons = [...document.querySelectorAll(".bag-btn")]
        buttonsDOM = buttons
        buttons.forEach(function(button){

            //get the id of each btn
            let id = button.dataset.id
            let inCart = cart.find(function(item){
                return item.id === id
            })
            if(inCart){
                button.innerText = "Already in Cart"
                button.disabled = true
            }else{

                // add item(product) in my cart
                button.addEventListener("click", function(event){
                    event.target.innerText = "In Cart"
                    event.target.disabled = true

                    // set the amount of items (only changed in cart api)
                    let cartItem = {...Storage.getProduct(id), amount:1}
                    cart = [...cart, cartItem]

                    // save the selected items in sorage
                    Storage.saveCart(cart)

                    //set the TOTAL value of cart
                    setCartValues(cart)

                    //display cart item
                    diplayCartItem(cartItem)

                    //display cart div and overlay
                    showCart()
                })
            }

            function setCartValues(cart){
                let tempTotal = 0
                let itemsTotal = 0
                cart.map(function(item){
                    tempTotal += item.price * item.amount
                    itemsTotal += item.amount
                })
                cartTotal.innerText = parseFloat(tempTotal.toFixed(2))
                cartItems.innerText = itemsTotal 
            }

            function diplayCartItem(item){
                const cartItemsDisplay = document.createElement("div")
                cartItemsDisplay.classList.add("cart-item")
                cartItemsDisplay.innerHTML = 
                `
                <div class="cart-item">
                    <img src=${item.image} alt="product">
                    <div>
                        <h4>${item.title}</h4>
                        <h5>${item.price}$</h5>
                        <span class="remove-item" data-id=${item.id}>remove</span>
                    </div>
                    <div>
                        <i class="up" data-id=${item.id}>+</i>
                        <p class="item-amount">${item.amount}</p>
                        <i class="down" data-id=${item.id}>-</i>
                    </div>
                </div>
                `
                cartContent.appendChild(cartItemsDisplay)
            }

            function showCart(){
                cartOverlay.classList.add("transparentBcg")
                cartDOM.classList.add("showCart")
            }
        })
    }
}

//products storage
class Storage {
    static saveProducts (products){
        localStorage.setItem("products", JSON.stringify(products))
    }
    static getProduct(id){
        let products = JSON.parse(localStorage.getItem("products"))
        return products.find(function(product){
             return product.id === id
        })
    }
    static saveCart(cart){
        localStorage.setItem("cart", JSON.stringify(cart))
    }
}

document.addEventListener("DOMContentLoaded",function(){
    const ui = new UI()
    const products = new Products()
    //get all products
    products.getProducts().then(function (products){
        ui.displayProducts(products)
        Storage.saveProducts(products)
    }).then(function(){
        ui.getBagButtons()
    })
})