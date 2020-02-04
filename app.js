

let cart = []


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
            console.log(products)
            return products
        }catch (error){
            console.log(error)
        }
    }
}


// ui manipulation
class UI {
    displayProducts(products){
        const cartBtn = document.querySelector(".cart-btn")
        const closeCartBtn = document.querySelector(".close-cart")
        const clearCart = document.querySelector(".clear-cart")
        const cartDOM = document.querySelector(".cart")
        const cartOverlay = document.querySelector(".cart-overlay")
        const cartContent = document.querySelector(".cart-content")
        const cartItems = document.querySelector(".cart-items")
        const cartTotal = document.querySelector(".cart-total")
        const productsDOM = document.querySelector(".products-center")
        let result = ""
        products.forEach(function (product) {
            result += `
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
        console.log(productsDOM)
        productsDOM.innerHTML = result
    }
}

//products storage
class Storage {
    static saveProducts (products){
        localStorage.setItem("products", JSON.stringify(products))
    }

}

document.addEventListener("DOMContentLoaded",function(){
    const ui = new UI()
    const products = new Products()
    //get all products
    products.getProducts().then(function (products){
        ui.displayProducts(products)
        Storage.saveProducts(products)
    })
})